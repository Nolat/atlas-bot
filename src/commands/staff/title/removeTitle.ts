import { Message, RichEmbed } from "discord.js";

// * GraphQL
import client from "graphql/client";

import removeTitle from "graphql/title/mutations/removeTitle";

import {
  RemoveTitleMutation,
  RemoveTitleMutationVariables
} from "generated/graphql";

// * Helper
import getParamFromResponse from "helpers/discord/getParamFromResponse";

// * Types
import { Command } from "types";

// * Constants
const QUESTION_TITLE = "🗑️ Suppression d'un titre";
const NAME_QUESTION = "Quel est le nom du titre à supprimer ?";

const RemoveTitleCommand: Command = {
  name: "removeTitle",
  aliases: ["rt", "rmTitle"],
  usage: "",
  description: "Supprime un titre",
  onlyStaff: true,
  run: (message: Message) => runRemoveTitle(message)
};

const runRemoveTitle = async (message: Message) => {
  const embed: RichEmbed = new RichEmbed();
  const name = await getParamFromResponse(
    message,
    QUESTION_TITLE,
    NAME_QUESTION,
    60000
  );

  const { data, errors } = await client.mutate<
    RemoveTitleMutation,
    RemoveTitleMutationVariables
  >({
    mutation: removeTitle,
    variables: { name },
    errorPolicy: "all"
  });

  if (data?.removeTitle) {
    embed
      .setTitle("🎉 Félicitations !")
      .setColor("GREEN")
      .setDescription(`Le titre ${name} a bien été suprimée.`);
  }

  if (errors) {
    errors.forEach((error: any) => {
      switch (error.extensions.code) {
        case "CANNOT_FIND_TITLE":
          embed
            .setColor("RED")
            .setTitle(":rotating_light: Suppression impossible !")
            .setDescription(`Le titre ${name} n'existe pas.`);
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

export default RemoveTitleCommand;
