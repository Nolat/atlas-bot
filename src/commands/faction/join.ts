import {
  Collection,
  Emoji,
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
  Faction
} from "generated/graphql";

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
    variables: { userId }
  });

  // With faction
  if (data?.user.faction) {
    const daysSinceJoined = moment
      .unix(Number(data?.user.joinedFactionAt))
      .diff(moment(), "days");

    if (daysSinceJoined > 7) {
      await buildText(embed, data.user.faction.id);
    } else {
      embed
        .setColor("RED")
        .setDescription(
          `Tu as rejoins une faction il y a moins de ${NUMBER_DAY_BEFORE_SWITCH_FACTION}, tu dois encore attendre avant de changer!`
        );
    }

    // Without faction
  } else {
    await buildText(embed);
  }

  sendMessageAndGetReact(message, embed);
};

const buildText = async (
  embed: RichEmbed,
  currentFactionId: string | undefined = undefined
) => {
  const text =
    "**Choisis ta faction que possède Edell parmis les suivantes :**\n";
  const { data } = await client.query<FactionsQuery, FactionsQueryVariables>({
    query: factions
  });

  if (data?.factions) {
    factions!.forEach((faction: Faction) => {
      if (faction.id !== currentFactionId) {
        text.concat(`\nLa faction **${faction.name}**, actuellement il y a ${
          faction.memberCount
        } membres sur les ${faction.maxMember} possible.\n
                Sont recrutement est ${
                  faction.isJoinable ? "ouvert" : "fermer"
                } pour le moment.\n
                Voici une description rapide de cette faction :\n
                ${faction.description}\n
                Sont icône est ${
                  faction.icon
                } clique dessus pour la choisir !\n`);
      }
    });
    embed.setDescription(text);
  } else throw new Error("No faction");
};

const sendMessageAndGetReact = async (message: Message, embed: RichEmbed) => {
  const choiceFactionMessage: Message | Message[] = await message.channel.send(
    embed
  );
  const { data } = await client.query<FactionsQuery, FactionsQueryVariables>({
    query: factions
  });
  const emojiListName: string[] = [];

  data.factions.forEach(faction => {
    emojiListName.push(
      message.guild.emojis.find((emoji: Emoji) => emoji.name === faction.icon)
        .name
    );
  });

  if (choiceFactionMessage instanceof Message) {
    emojiListName.forEach(name => choiceFactionMessage.react(name));

    const filter = (reaction: MessageReaction, user: User) => {
      return (
        emojiListName.includes(reaction.emoji.name) &&
        user.id === message.author.id
      );
    };

    choiceFactionMessage
      .awaitReactions(filter, { max: 2 })
      .then(async (collected: Collection<string, MessageReaction>) => {
        getResponseAndSetFaction(message.author.id, collected);
      });
  }
};

const getResponseAndSetFaction = async (
  userId: string,
  collected: Collection<string, MessageReaction>
) => {
  const awnser = collected.find("count", 2).emoji.name;

  const { data } = await client.query<FactionsQuery, FactionsQueryVariables>({
    query: factions
  });

  const factionName: string | undefined = data?.factions.find(fac => {
    return fac.icon === awnser;
  }).name;
};

export default JoinCommand;
