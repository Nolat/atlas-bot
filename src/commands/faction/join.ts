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
  UnsetUserFactionMutationVariables,
  Faction
} from "generated/graphql";
import setUserFaction from "graphql/user/mutation/setUserFaction";
import unsetUserFaction from "graphql/user/mutation/unsetUserFaction";

// * Type
type FactionType = {
  __typename?: "Faction" | undefined;
} & Pick<
  Faction,
  | "id"
  | "name"
  | "description"
  | "icon"
  | "color"
  | "memberCount"
  | "maxMember"
  | "isJoinable"
>;

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
  if (data?.user.faction && data?.user.joinedFactionAt) {
    const joinedDate = moment(Number(data?.user.joinedFactionAt));

    const daysSinceJoined = moment().diff(joinedDate, "d");
    const timeSinceJoined = joinedDate.locale("fr").fromNow();

    const dateAble = joinedDate.add(7, "d");
    const timeUntilAble = dateAble.locale("fr").toNow(true);

    if (daysSinceJoined >= DAYS_LIMIT)
      handleEmbed(message, embed, data.user.faction.name);
    else {
      embed
        .setTitle("🚨 Demande impossible")
        .setColor("RED")
        .setDescription(
          `Tu as rejoins une faction, ${timeSinceJoined}.\n Tu dois encore attendre ${timeUntilAble} avant de changer!`
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
  const channelFactions: Channel = guild.channels.find(
    channel => channel.name === "factions"
  );

  embed.setTitle("🛡️ Choix de ta faction").setColor("GOLD");

  if (data?.factions) {
    data.factions.forEach(faction => {
      if (faction.name !== currentFactionName) {
        embed.addField(
          `**${faction.icon}  ${faction.name}**`,
          `${faction.memberCount}/${faction.maxMember} membres`
        );
      }
    });

    embed.addField(
      "Pour plus d'information",
      `➡️ ${channelFactions.toString()}`
    );
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
    if (currentFactionName !== faction.name && faction.isJoinable)
      emojiListName.push(faction.icon);
  });

  for (const name of emojiListName) {
    await choiceFactionMessage.react(name);
  }

  const filter = (reaction: MessageReaction, user: User) => {
    return (
      emojiListName.includes(reaction.emoji.name) &&
      user.id === message.author.id
    );
  };

  choiceFactionMessage
    .awaitReactions(filter, { max: 1 })
    .then((collected: Collection<string, MessageReaction>) => {
      const emoji = collected.first().emoji.name;

      getResponseAndSetFaction(message, emoji, data, currentFactionName);

      choiceFactionMessage.clearReactions();
    });
};

const getResponseAndSetFaction = async (
  message: Message,
  emoji: string,
  data: FactionsQuery,
  currentFactionName: string | undefined = undefined
) => {
  const { id } = message.author;

  const faction = data.factions.find((f: FactionType) => f.icon === emoji);

  if (!faction) {
    const embed = new RichEmbed()
      .setColor("RED")
      .setTitle(":rotating_light: Erreur innatendue !")
      .setDescription(`Merci de contacter le Staff.`);

    message.channel.send({ embed });
  } else {
    if (currentFactionName)
      await client.mutate<
        UnsetUserFactionMutation,
        UnsetUserFactionMutationVariables
      >({ mutation: unsetUserFaction, variables: { id } });

    const result = await client.mutate<
      SetUserFactionMutation,
      SetUserFactionMutationVariables
    >({
      mutation: setUserFaction,
      variables: { factionName: faction.name, id }
    });

    if (result.data) {
      const embed = new RichEmbed()
        .setColor(faction.color)
        .setTitle(`${faction.icon} Félicitation !`)
        .setDescription(
          `Tu es maintenant membre de ${
            faction.name
          }, ${message.author.toString()}!`
        );

      message.channel.send({ embed });
    }
  }
};

export default JoinCommand;
