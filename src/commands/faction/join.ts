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
  SetUserFactionMutation,
  SetUserFactionMutationVariables,
  UnsetUserFactionMutation,
  UnsetUserFactionMutationVariables
} from "generated/graphql";
import setUserFaction from "graphql/user/mutation/setUserFaction";
import unsetUserFaction from "graphql/user/mutation/unsetUserFaction";

// * Constants
const DAYS_LIMIT = 7;

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
  const { id } = user;

  const { data } = await client.query<
    UserFactionQuery,
    UserFactionQueryVariables
  >({
    query: userFaction,
    variables: { id },
    fetchPolicy: "network-only"
  });

  // * With faction
  if (data?.user.faction) {
    const daysSinceJoined = moment().diff(data?.user.joinedFactionAt!, "d");

    if (daysSinceJoined > DAYS_LIMIT)
      handleEmbed(message, embed, data.user.faction.name);
    else {
      embed
        .setColor("RED")
        .setDescription(
          `Tu as rejoins une faction il y a moins de ${DAYS_LIMIT} jours, tu dois encore attendre avant de changer!`
        );

      await message.channel.send(embed);
    }

    // * Without faction
  } else handleEmbed(message, embed);
};

const handleEmbed = async (
  message: Message,
  embed: RichEmbed,
  currentFactionName?: string
) => {
  const { data } = await client.query<FactionsQuery, FactionsQueryVariables>({
    query: factions,
    fetchPolicy: "network-only"
  });

  await buildEmbed(embed, message.guild, data, currentFactionName);
  await sendMessageAndGetReact(message, embed, data, currentFactionName);
};

const buildEmbed = async (
  embed: RichEmbed,
  guild: Guild,
  data: FactionsQuery,
  currentFactionName?: string
) => {
  embed.setTitle(
    "**Choisis ta faction que possède Edell parmis les suivantes :**"
  );

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
  data: FactionsQuery,
  currentFactionName?: string
) => {
  const emojiListName: string[] = [];

  const choiceFactionMessage: Message = (await message.channel.send(
    embed
  )) as Message;

  data.factions.forEach(faction => {
    if (currentFactionName !== faction.name) emojiListName.push(faction.icon);
  });

  emojiListName.forEach(name => choiceFactionMessage.react(name));
  const filter = (reaction: MessageReaction, reactUser: User) => {
    return (
      emojiListName.includes(reaction.emoji.name) &&
      reactUser.id === message.author.id
    );
  };

  choiceFactionMessage
    .awaitReactions(filter, { max: 1 })
    .then(async (collected: Collection<string, MessageReaction>) => {
      const emoji = collected.first().emoji.name;

      getResponseAndSetFaction(
        message.author.id,
        emoji,
        data,
        currentFactionName
      );

      choiceFactionMessage.clearReactions();
    });
};

const getResponseAndSetFaction = async (
  id: string,
  emoji: string,
  data: FactionsQuery,
  currentFactionName: string | undefined = undefined
) => {
  const factionName: string = data.factions.find(
    faction => faction.icon === emoji
  )!.name;

  if (currentFactionName)
    await client.mutate<
      UnsetUserFactionMutation,
      UnsetUserFactionMutationVariables
    >({ mutation: unsetUserFaction, variables: { id } });

  await client.mutate<SetUserFactionMutation, SetUserFactionMutationVariables>({
    mutation: setUserFaction,
    variables: { factionName, id }
  });
};

export default JoinCommand;
