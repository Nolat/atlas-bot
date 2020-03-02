import { Message, RichEmbed } from "discord.js";

// * GraphQL
import client from "graphql/client";

import removeTitleBranch from "graphql/titleBranch/mutations/removeTitleBranch";

import {
  RemoveTitleBranchMutation,
  RemoveTitleBranchMutationVariables
} from "generated/graphql";

// * Helper
import getParamFromResponse from "helpers/discord/getParamFromResponse";

// * Types
import { Command } from "types";

// * Constants
const QUESTION_TITLE = "🗑️ Suppression d'une branche";
const NAME_QUESTION = "Quel est le nom de la branche à supprimer ?";

const RemoveTitleBranchCommand: Command = {
  name: "removeBranch",
  aliases: ["rb", "rmBranch"],
  usage: "",
  description: "Supprime une branche de titre",
  onlyStaff: true,
  run: (message: Message) => runRemoveTitleBranch(message)
};

const runRemoveTitleBranch = async (message: Message) => {
  const embed: RichEmbed = new RichEmbed();
  const name = await getParamFromResponse(
    message,
    QUESTION_TITLE,
    NAME_QUESTION,
    60000
  );

  const { data, errors } = await client.mutate<
    RemoveTitleBranchMutation,
    RemoveTitleBranchMutationVariables
  >({
    mutation: removeTitleBranch,
    variables: { name },
    errorPolicy: "all"
  });

  if (data?.removeTitleBranch) {
    embed
      .setTitle("🎉 Félicitations !")
      .setColor("GREEN")
      .setDescription(`La brach ${name} a bien été suprimée.`);
  }

  if (errors) {
    errors.forEach((error: any) => {
      switch (error.extensions.code) {
        case "CANNOT_FIND_BRANCH":
          embed
            .setColor("RED")
            .setTitle(":rotating_light: Suppression impossible !")
            .setDescription(`La branche ${name} n'existe pas.`);
          break;
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
};

export default RemoveTitleBranchCommand;
