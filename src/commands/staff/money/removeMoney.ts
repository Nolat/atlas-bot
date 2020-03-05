import { Message, RichEmbed } from "discord.js";

// * GraphQL
import client from "graphql/client";

import removeUserMoney from "graphql/user/mutation/removeUserMoney";

// * Helper
import getMentionsFromResponse from "helpers/discord/getMentionsFromResponse";

// * Types
import { Command } from "types";

import {
  RemoveUserMoneyMutation,
  RemoveUserMoneyMutationVariables
} from "generated/graphql";

// * Money helpers
import askMoney from "commands/helpers/money/askMoney";
import getMoneyString from "commands/helpers/money/getMoneyString";

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

  const amount = await askMoney(message, QUESTION_TITLE, HOW_QUESTION);

  mentions.users.forEach(async user => {
    const { id } = user;

    const { data, errors } = await client.mutate<
      RemoveUserMoneyMutation,
      RemoveUserMoneyMutationVariables
    >({
      mutation: removeUserMoney,
      variables: { id, amount },
      errorPolicy: "all"
    });

    if (data?.removeUserMoney)
      embed
        .setTitle("🎉 Félicitations !")
        .setColor("GREEN")
        .setDescription(
          `${user.toString()} a perdu ${getMoneyString(amount)}.`
        );

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

export default removeMoneyCommand;
