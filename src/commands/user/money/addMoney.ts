import { Message, RichEmbed, MessageMentions } from "discord.js";

// * GraphQL
import client from "graphql/client";

import addMoney from "graphql/user/mutation/addMoney";

// * Helper
import getParamFromResponse from "helpers/discord/getParamFromResponse";

// * Types
import { Command } from "types";

import {
  GiveUserMoneyMutation,
  GiveUserMoneyMutationVariables
} from "generated/graphql";

//* Constants
const MONEY_QUESTION = ":moneybag: Gain d'argent";
const WHO_QUESTION = "Doctor Who?";
const HOW_QUESTION = "Combien avez vous gagner";

const addMoneyCommand: Command = {
  name: "addMoney",
  aliases: ["a$"],
  usage: "",
  description: "donne l'argent",
  onlyStaff: true,
  run: (message: Message) => runAddMoney(message)
};

const runAddMoney = async (message: Message) => {
  const embed: RichEmbed = new RichEmbed();

  try {
    const id = await getParamFromResponse(
      message,
      `${MONEY_QUESTION}`,
      WHO_QUESTION,
      60000
    );

    const money = await Number(
      getParamFromResponse(message, `${MONEY_QUESTION}`, HOW_QUESTION, 6000)
    );

    const { data, errors } = await client.mutate<
      GiveUserMoneyMutation,
      GiveUserMoneyMutationVariables
    >({
      mutation: addMoney,
      variables: { id, money },
      errorPolicy: "all"
    });
  } catch (error) {
    console.log(error);
  }
  message.channel.send(embed);
};
export default addMoneyCommand;
