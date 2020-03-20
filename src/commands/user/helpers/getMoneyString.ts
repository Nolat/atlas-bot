import { Message } from "discord.js";

const getMoneyString = (message: Message, money: number): string => {
  let text = "";

  const pp = Math.floor(money / 1000000);
  const po = Math.floor((money - pp * 1000000) / 10000);
  const pa = Math.floor((money - pp * 1000000 - po * 10000) / 100);
  const pc = Math.floor(money - pp * 1000000 - po * 10000 - pa * 100);

  const ppEmoji = message.guild.emojis.find(emoji => emoji.name === "pp");
  const poEmoji = message.guild.emojis.find(emoji => emoji.name === "po");
  const paEmoji = message.guild.emojis.find(emoji => emoji.name === "pa");
  const pcEmoji = message.guild.emojis.find(emoji => emoji.name === "pc");

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

export default getMoneyString;
