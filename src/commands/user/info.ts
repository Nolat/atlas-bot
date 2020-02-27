import { Message, RichEmbed, User } from "discord.js";
import moment from "moment";

// * GraphQL
import client from "graphql/client";

import userInfo from "graphql/user/queries/userInfo";

import { UserInfoQuery, UserInfoQueryVariables } from "generated/graphql";

// * Types
import { Command } from "types";

// * Helpers
import getPercentOfNextLevel from "./helpers/getPercentOfNextLevel";
import getXPLimitByLevel from "./helpers/getXPLimitByLevel";

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
    mentions.members.forEach(member => getInfoForMember(message, member.user));
  else getInfoForMember(message, message.author);
};

const getInfoForMember = async (message: Message, user: User) => {
  const embed = new RichEmbed();

  const { data } = await client.query<UserInfoQuery, UserInfoQueryVariables>({
    query: userInfo,
    variables: { id: user.id },
    fetchPolicy: "network-only"
  });
  const { faction } = data.user;
  const joinedFactionAt = moment(Number(data?.user.joinedFactionAt!))
    .locale("fr")
    .format("LL");

  embed.setTitle(user.username);
  if (faction) {
    embed
      .setDescription(
        `${faction.icon} Membre de **${faction.name}** depuis le ${joinedFactionAt}`
      )
      .setColor(faction.color);
  } else embed.setColor("GOLD");

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

  message.channel.send(embed);
};

const getMoneyString = (message: Message, money: number): string => {
  let text = "";

  const pp = Math.floor(money / 1000000);
  const po = Math.floor((money - pp * 1000000) / 10000);
  const pa = Math.floor((money - pp * 1000000 - po * 10000) / 100);
  const pc = Math.floor(money - pp * 1000000 - po * 10000 - pa * 100);

  const ppEmoji = message.guild.emojis.find(emoji => emoji.name.includes("pp"));
  const poEmoji = message.guild.emojis.find(emoji => emoji.name.includes("po"));
  const paEmoji = message.guild.emojis.find(emoji => emoji.name.includes("pa"));
  const pcEmoji = message.guild.emojis.find(emoji => emoji.name.includes("pc"));

  if (pp > 0)
    text =
      pp > 1
        ? text.concat(`${ppEmoji} **${pp}** pièces de Platine`)
        : text.concat(`${ppEmoji} **${pp}** pièce de Platine`);

  if (pp > 0 && (po > 0 || pa > 0 || pc > 0)) text = text.concat(`\n`);

  if (po > 0)
    text =
      po > 1
        ? text.concat(`${poEmoji} **${po}** pièces d'Or`)
        : text.concat(`${poEmoji} **${po}** pièce d'Or`);

  if (po > 0 && (pa > 0 || pc > 0)) text = text.concat(`\n`);

  if (pa > 0)
    text =
      pa > 1
        ? text.concat(`${paEmoji} **${pa}** pièces d'Argent`)
        : text.concat(`${paEmoji} **${pa}** pièce d'Argent`);

  if (pa > 0 && pc > 0) text = text.concat(`\n`);

  if (pc > 0)
    text =
      pc > 1
        ? text.concat(`${pcEmoji} **${pc}** pièces de Cuivre`)
        : text.concat(`${pcEmoji} **${pc}** pièce de Cuivre`);

  if (!pp && !po && !pa && !pc) text = "Aucune pièce";

  return text;
};
export default InfoCommand;
