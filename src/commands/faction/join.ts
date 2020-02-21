import {
  Channel,
  Collection,
  Guild,
  Message,
  MessageReaction,
  RichEmbed,
  User
} from "discord.js";
import moment from "moment";

// * Types
import { Command } from "types";

// * Constants
import { NUMBER_DAY_BEFORE_SWITCH_FACTION } from "utils/globalVariables";

// * GraphQL client
import client from "graphql/client";

// * GraphQL Queries
import userFaction from "graphql/user/queries/userFaction";
import factions from "graphql/faction/queries/factions";

// * GraphQL Types
import {
  FactionsQuery,
  FactionsQueryVariables,
  UserFactionQuery,
  UserFactionQueryVariables,
  Faction,
  SetUserFactionMutation,
  SetUserFactionMutationVariables,
  UnsetUserFactionMutation,
  UnsetUserFactionMutationVariables
} from "generated/graphql";
import setUserFaction from "graphql/user/mutation/setUserFaction";
import unsetUserFaction from "graphql/user/mutation/unsetUserFaction";

const JoinCommand: Command = {
  name: "join",
  aliases: ["j"],
  usage: "",
  description:
    "Permet de rejoindre une des 3 factions ou d'en changer après une semaine",
  onlyStaff: false,
  run: (message: Message) => runJoin(message)
};

const runJoin = async (message: Message) => {
  const embed: RichEmbed = new RichEmbed();
  const user: User = message.author;
  const userId: string = user.id;

  const { data } = await client.query<
    UserFactionQuery,
    UserFactionQueryVariables
  >({
    query: userFaction,
    variables: { userId },
    fetchPolicy: "network-only"
  });

  // With faction
  if (data?.user.faction) {
    const daysSinceJoined =
      moment().diff(moment(Number(data?.user.joinedFactionAt!)), "d") + 8;

    if (daysSinceJoined > 7) {
      await buildText(embed, message.guild, data.user.faction.name);
      await sendMessageAndGetReact(message, embed, data.user.faction.name);
    } else {
      embed
        .setColor("RED")
        .setDescription(
          `Tu as rejoins une faction il y a moins de ${NUMBER_DAY_BEFORE_SWITCH_FACTION} jours, tu dois encore attendre avant de changer!`
        );

      await message.channel.send(embed);
    }

    // Without faction
  } else {
    await buildText(embed, message.guild);
    await sendMessageAndGetReact(message, embed);
  }
};

const buildText = async (
  embed: RichEmbed,
  guild: Guild,
  currentFactionName: string | undefined = undefined
) => {
  embed.setTitle(
    "**Choisis ta faction que possède Edell parmis les suivantes :**"
  );
  const { data } = await client.query<FactionsQuery, FactionsQueryVariables>({
    query: factions,
    fetchPolicy: "network-only"
  });

  if (data?.factions) {
    data.factions.forEach(faction => {
      const channelFactions: Channel = guild.channels.find(
        channel => channel.name === "factions"
      );

      if (faction.name !== currentFactionName) {
        embed.addField(
          `La faction **${faction.name} ${faction.icon}**`,
          `Actuellement il y a ${faction.memberCount} membres sur les ${
            faction.maxMember
          } possible.\n
                 Pour plus d'information ${channelFactions.toString()}`
        );
      }
    });
  } else throw new Error("No faction");
};

const sendMessageAndGetReact = async (
  message: Message,
  embed: RichEmbed,
  currentFactionName: string | undefined = undefined
) => {
  const choiceFactionMessage: Message | Message[] = await message.channel.send(
    embed
  );
  const { data } = await client.query<FactionsQuery, FactionsQueryVariables>({
    query: factions,
    fetchPolicy: "network-only"
  });
  const emojiListName: string[] = [];

  data.factions.forEach(faction => {
    if (!currentFactionName || currentFactionName !== faction.name)
      emojiListName.push(faction.icon);
  });

  if (choiceFactionMessage instanceof Message) {
    emojiListName.forEach(name => choiceFactionMessage.react(name));
    const filter = (reaction: MessageReaction, reactUser: User) => {
      return (
        emojiListName.includes(reaction.emoji.name) &&
        reactUser.id === message.author.id
      );
    };

    await choiceFactionMessage
      .awaitReactions(filter, { max: 1 })
      .then(async (collected: Collection<string, MessageReaction>) => {
        await getResponseAndSetFaction(
          message.author.id,
          collected,
          data.factions,
          currentFactionName
        );
      });

    await choiceFactionMessage.clearReactions();
  }
};

const getResponseAndSetFaction = async (
  userId: string,
  collected: Collection<string, MessageReaction>,
  factionList: Array<
    { __typename?: "Faction" } & Pick<
      Faction,
      | "id"
      | "description"
      | "name"
      | "memberCount"
      | "maxMember"
      | "isJoinable"
      | "icon"
    >
  >,
  currentFactionName: string | undefined = undefined
) => {
  const awnser = collected.find("count", 2).emoji.name;

  const factionName: string = factionList.find(fac => fac.icon === awnser)!
    .name;

  if (currentFactionName)
    await client.mutate<
      UnsetUserFactionMutation,
      UnsetUserFactionMutationVariables
    >({ mutation: unsetUserFaction, variables: { id: userId } });

  await client.mutate<SetUserFactionMutation, SetUserFactionMutationVariables>({
    mutation: setUserFaction,
    variables: { factionName, id: userId }
  });
};

export default JoinCommand;
