import { Message, RichEmbed } from "discord.js";

// * GraphQL
import client from "graphql/client";

import giveUserMoney from "graphql/user/mutation/giveUserMoney";

// * Helper
import getMentionsFromResponse from "helpers/discord/getMentionsFromResponse";

// * Types
import { Command } from "types";

import {
  GiveUserMoneyMutation,
  GiveUserMoneyMutationVariables
} from "generated/graphql";

// * Money helpers
import askMoney from "commands/helpers/money/askMoney";
import getMoneyString from "commands/helpers/money/getMoneyString";

//* Constants
const QUESTION_TITLE = ":moneybag: Gain d'argent";
const USER_QUESTION = "À quel(s) joueur(s) voulez-vous ajouter de l'argent ?";
const HOW_QUESTION = "Combien d'argent voulez-vous ajouter ? (ex: 1po 3pa 1pc)";

const addMoneyCommand: Command = {
  name: "addMoney",
  aliases: ["am"],
  usage: "",
  description: "Donne de l'argent à un ou plusieurs joueur(s)",
  onlyStaff: true,
  run: (message: Message) => runAddMoney(message)
};

const runAddMoney = async (message: Message) => {
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

  const money = await askMoney(message, QUESTION_TITLE, HOW_QUESTION);

  mentions.users.forEach(async user => {
    const { id } = user;

    const { data, errors } = await client.mutate<
      GiveUserMoneyMutation,
      GiveUserMoneyMutationVariables
    >({
      mutation: giveUserMoney,
      variables: { id, money },
      errorPolicy: "all"
    });

    if (data?.giveUserMoney)
      embed
        .setTitle("🎉 Félicitations !")
        .setColor("GREEN")
        .setDescription(`${user.toString()} a reçu ${getMoneyString(money)}.`);

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

export default addMoneyCommand;
