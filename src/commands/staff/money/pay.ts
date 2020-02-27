import { Message, RichEmbed, MessageMentions } from "discord.js";

// * GraphQL
import client from "graphql/client";

import giveUserMoney from "graphql/user/mutation/giveUserMoney";
import removeUserMoney from "graphql/user/mutation/removeUserMoney";

import userInfo from "graphql/user/queries/userInfo";

import { GraphQLError } from "graphql";

import {
  GiveUserMoneyMutation,
  GiveUserMoneyMutationVariables,
  UserInfoQuery,
  UserInfoQueryVariables,
  RemoveUserMoneyMutation,
  RemoveUserMoneyMutationVariables
} from "generated/graphql";

// * Types
import { Command } from "types";

// * Helper
import callIfConfirmed from "commands/user/helpers/askConfirmation";
import getMentionsFromResponse from "helpers/discord/getMentionsFromResponse";
import getMoneyString from "./helpers/getMoneyString";
import askMoney from "./helpers/askMoney";

//* Constants
const QUESTION_TITLE = ":moneybag: Virement d'argent";
const USER_QUESTION = "À quel(s) joueur(s) voulez-vous envoyer de l'argent ?";
const AMOUNT_QUESTION =
  "Combien d'argent voulez-vous envoyer ? (ex: 1po 3pa 1pc)";

const payCommand: Command = {
  name: "pay",
  aliases: ["p"],
  usage: "",
  description: "Donne de l'argent à un ou plusieurs joueur(s)",
  onlyStaff: false,
  run: (message: Message) => runPay(message)
};

const runPay = async (message: Message) => {
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

  if (mentions.users.find(user => user === message.author)) {
    embed
      .setColor("RED")
      .setTitle(":rotating_light: Erreur !")
      .setDescription(`Vous ne pouvez pas envoyer de l'argent à vous-même.`);
    message.channel.send(embed);
    return;
  }

  // How much user wants to pay mention(s)
  const { data } = await client.query<UserInfoQuery, UserInfoQueryVariables>({
    query: userInfo,
    variables: { id: message.author.id },
    fetchPolicy: "network-only"
  });

  const userBalance = `\n\nVous avez : ${getMoneyString(data.user.money)}`;
  const money = await askMoney(
    message,
    QUESTION_TITLE,
    AMOUNT_QUESTION + userBalance
  );
  // Check if user has enough money
  if (!canUserPay(message, money, data)) return;

  // Ask confirmation
  embed
    .setColor("GOLD")
    .setTitle("Confirmation du virement.")
    .setDescription(
      `Êtes-vous sûr de vouloir payer ${getMoneyString(money)} ?`
    );

  callIfConfirmed(
    message,
    embed,
    () => payToMentions(message, money, mentions),
    () => {
      embed
        .setColor("RED")
        .setTitle("Virement annulé")
        .setDescription(`Le virement a été annulé.`);
      message.channel.send(embed);
    }
  );
};

const payToMentions = async (
  message: Message,
  money: number,
  mentions: MessageMentions
) => {
  // * Remove money to user
  const errorsRem = await removeMoneyToUser(message.author.id, money);
  if (errorsRem) {
    errorsRem.forEach((error: any) => {
      const embed = new RichEmbed();
      switch (error.extensions.code) {
        default:
          embed
            .setColor("RED")
            .setTitle(":no: Virement annulé !")
            .setDescription("Vous avez annulé la transaction.");
          message.channel.send(embed);
          break;
      }
    });
  }

  // * Add money to target(s)
  mentions.users.forEach(async user => {
    const embed = new RichEmbed();
    const { id } = user;

    const { data, errors } = await client.mutate<
      GiveUserMoneyMutation,
      GiveUserMoneyMutationVariables
    >({
      mutation: giveUserMoney,
      variables: { id, money },
      errorPolicy: "all"
    });

    if (data?.giveUserMoney) {
      embed
        .setTitle("🎉 Félicitations !")
        .setColor("GREEN")
        .setDescription(
          `${user.toString()} a été crédité de ${getMoneyString(
            money
          )} par ${message.author.toString()}`
        );
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

const canUserPay = async (
  message: Message,
  amount: number,
  data: UserInfoQuery
): Promise<boolean> => {
  const embed = new RichEmbed();

  if (data.user.money < amount) {
    embed
      .setColor("RED")
      .setTitle(":no: Virement annulé !")
      .setDescription("Vous n'avez pas assez d'argent pour payer.");
    message.channel.send(embed);
  }

  return data.user.money >= amount;
};

const removeMoneyToUser = async (
  id: string,
  amount: number
): Promise<readonly GraphQLError[] | undefined> => {
  const { errors } = await client.mutate<
    RemoveUserMoneyMutation,
    RemoveUserMoneyMutationVariables
  >({
    mutation: removeUserMoney,
    variables: { id, amount },
    errorPolicy: "all"
  });

  return errors;
};

export default payCommand;
