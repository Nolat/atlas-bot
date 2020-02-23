import { Message, RichEmbed } from "discord.js";

// * GraphQL
import client from "graphql/client";

import removeUserMoney from "graphql/user/mutation/removeUserMoney";

// * Helper
import getMentionsFromResponse from "helpers/discord/getMentionsFromResponse";
import getParamFromResponse from "helpers/discord/getParamFromResponse";

// * Types
import { Command } from "types";

import {
  RemoveUserMoneyMutation,
  RemoveUserMoneyMutationVariables
} from "generated/graphql";

//* Constants
const QUESTION_TITLE = ":moneybag: Retrait d'argent";
const USER_QUESTION = "À quel(s) joueur(s) voulez-vous retirer de l'argent ?";
const HOW_QUESTION = "Combien d'argent voulez-vous retirer ? (ex: 1po 3pa 1pc)";

const removeMoneyCommand: Command = {
  name: "removeMoney",
  aliases: ["rm"],
  usage: "",
  description: "Retire de l'argent à un ou plusieurs joueur(s)",
  onlyStaff: true,
  run: (message: Message) => runRemoveMoney(message)
};

const runRemoveMoney = async (message: Message) => {
  const embed: RichEmbed = new RichEmbed();

  const mentions = await getMentionsFromResponse(
    message,
    QUESTION_TITLE,
    USER_QUESTION,
    60000
  );

  if (!mentions.users.size) {
    embed
      .setColor("RED")
      .setTitle(":rotating_light: Erreur !")
      .setDescription(`Réponse innatendue.`);
    message.channel.send(embed);
    return;
  }

  const money = await askMoney(message);

  mentions.users.forEach(async user => {
    const { id } = user;

    const { data, errors } = await client.mutate<
      RemoveUserMoneyMutation,
      RemoveUserMoneyMutationVariables
    >({
      mutation: removeUserMoney,
      variables: { id, money },
      errorPolicy: "all"
    });

    if (data?.removeUserMoney) {
      embed
        .setTitle("🎉 Félicitations !")
        .setColor("GREEN")
        .setDescription(`${user.toString()} a perdu ${getMoneyString(money)}.`);
    }

    if (errors) {
      errors.forEach((error: any) => {
        switch (error.extensions.code) {
          default:
            embed
              .setColor("RED")
              .setTitle(":rotating_light: Erreur innatendue !")
              .setDescription(`Merci de contacter le Staff.`);
            break;
        }
      });
    }

    message.channel.send(embed);
  });
};

const askMoney = async (message: Message): Promise<number> => {
  const params = await getParamFromResponse(
    message,
    `${QUESTION_TITLE}`,
    HOW_QUESTION,
    60000
  );
  const values = params.split(" ");
  let money = 0;

  values.forEach(value => {
    switch (value.replace(/[0-9]/g, "")) {
      case "po":
        money += Number(value.replace("po", "")) * 100;
        break;

      case "pa":
        money += Number(value.replace("pa", "")) * 10;
        break;

      case "pc":
        money += Number(value.replace("pc", ""));
        break;

      default:
        money += Number(value);
        break;
    }
  });

  return money;
};

const getMoneyString = (money: number): string => {
  const values = money.toString().split("");
  let text = "";

  const pc = Number(values.pop());
  const pa = Number(values.pop());
  const po = Number(values.join());

  if (po > 0)
    text =
      po > 1
        ? text.concat(`${po} pièces d'Or`)
        : text.concat(`${po} pièce d'Or`);
  if (po > 0 && pa > 0) text = text.concat(` & `);
  if (pa > 0)
    text =
      pa > 1
        ? text.concat(`${pa} pièces d'Argent`)
        : text.concat(`${pa} pièce d'Argent`);
  if (pa > 0 && pc > 0) text = text.concat(` & `);
  if (pc > 0)
    text =
      pc > 1
        ? text.concat(`${pc} pièces de Cuivre`)
        : text.concat(`${pc} pièce de Cuivre`);

  if (!po && !pa && !pc) text = "aucune pièce";

  return text;
};

export default removeMoneyCommand;
