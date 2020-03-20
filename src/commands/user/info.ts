import { Message, RichEmbed, User, MessageReaction } from "discord.js";
import moment from "moment";

// * GraphQL
import client from "graphql/client";

import userInfo from "graphql/user/queries/userInfo";

import {
  UserInfoQuery,
  UserInfoQueryVariables,
  Maybe,
  Faction
} from "generated/graphql";

// * Types
import { Command } from "types";

// * Helpers
import getMoneyString from "./helpers/getMoneyString";
import getPercentOfNextLevel from "./helpers/getPercentOfNextLevel";
import getXPLimitByLevel from "./helpers/getXPLimitByLevel";

// * Interface
type FactionType = Maybe<
  { __typename?: "Faction" } & Pick<Faction, "name" | "icon" | "color">
>;

const InfoCommand: Command = {
  name: "info",
  aliases: ["i"],
  usage: "[@membre | nomFaction]",
  description: "Affiche le information d'un utilisateur ou d'une faction",
  onlyStaff: false,
  run: (message: Message) => runInfo(message)
};

const runInfo = (message: Message) => {
  const { mentions } = message;

  if (mentions.members.size)
    mentions.members.forEach(member => sendInfoMessage(message, member.user));
  else sendInfoMessage(message, message.author);
};

const sendInfoMessage = async (message: Message, user: User) => {
  const defaultInfoEmbed = await buildInfoEmbedPage(message, user, 0, true);

  const infoMessage = (await message.channel.send(defaultInfoEmbed)) as Message;
  buildPagination(infoMessage, user, message.author);
};

const buildPagination = async (
  infoMessage: Message,
  user: User,
  author: User,
  pageId = 0
) => {
  const emojiList: string[] = [];
  if (pageId > 0) emojiList.push("⏪");
  if (pageId < 1) emojiList.push("⏩");

  for (const emoji of emojiList) {
    await infoMessage.react(emoji);
  }

  const filter = (reaction: MessageReaction, checkedUser: User) => {
    return (
      emojiList.includes(reaction.emoji.name) && checkedUser.id === author.id
    );
  };

  infoMessage.awaitReactions(filter, { max: 1 }).then(async collected => {
    await infoMessage.clearReactions();

    const newId =
      collected.first().emoji.name === "⏪" ? pageId - 1 : pageId + 1;

    infoMessage.edit(await buildInfoEmbedPage(infoMessage, user, newId));
    buildPagination(infoMessage, user, author, newId);
  });
};

const buildInfoEmbedPage = async (
  message: Message,
  user: User,
  pageId: number,
  forceFetch = false
): Promise<RichEmbed> => {
  const infoEmbed = new RichEmbed();

  const { data } = await client.query<UserInfoQuery, UserInfoQueryVariables>({
    query: userInfo,
    variables: { id: user.id },
    fetchPolicy: forceFetch ? "network-only" : "cache-first"
  });

  if (data.user.faction) {
    infoEmbed.setColor(data.user.faction.color);
  } else infoEmbed.setColor("GOLD");

  infoEmbed.setTitle(user.username);

  switch (pageId) {
    case 0:
      await buildGeneralInfoPage(infoEmbed, message, data);
      break;

    case 1:
      await buildTitleInfoPage(infoEmbed, message, data);
      break;

    default:
      break;
  }

  return infoEmbed;
};

const buildGeneralInfoPage = async (
  embed: RichEmbed,
  message: Message,
  data: UserInfoQuery
) => {
  const { faction } = data.user;

  if (faction) {
    const joinedFactionAt = moment(Number(data?.user.joinedFactionAt!))
      .locale("fr")
      .format("LL");

    embed.setDescription(
      `${faction.icon} Membre de **${faction.name}** depuis le ${joinedFactionAt}`
    );
  }

  embed.addField("Monnaie", getMoneyString(message, data.user.money));

  if (faction) {
    const nextXP = getXPLimitByLevel(data.user.level ? data.user.level + 1 : 1);
    const percent = getPercentOfNextLevel(data.user.experience || 0, nextXP);

    let xpBar = "";
    for (let index = 10; index < percent; index += 10) xpBar += "🟩 ";

    for (let index = 100; index > percent; index -= 10) xpBar += "⬜ ";

    embed.addField(
      "Experience",
      `Niveau **${data.user.level || 0}**
    
        ${xpBar}`
    );
  }
};

const buildTitleInfoPage = async (
  embed: RichEmbed,
  message: Message,
  data: UserInfoQuery
) => {
  const { faction, titles } = data.user;

  embed.setTitle(`${data.user.username} - Titres`);

  if (!faction || !titles) {
    embed.setDescription(":warning: Il n'y a aucun tire à afficher.");
  } else {
    titles.forEach(userTitle => {
      if (userTitle.title.faction) {
        if (userTitle.title.faction.name === faction.name) {
          const { title } = userTitle;
          if (title.level) {
            embed.addField(`Niveau **${title.level}**`, title.name);
          }

          if (title.branch) {
            embed.setDescription(`Branche **${title.branch.name}**`);
          }
        }
      }
    });
  }
};

export default InfoCommand;
