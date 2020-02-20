import { Message, RichEmbed } from "discord.js";

// * GraphQL
import client from "graphql/client";

import removeFaction from "graphql/faction/mutations/removeFaction";

import {
  RemoveFactionMutation,
  RemoveFactionMutationVariables
} from "generated/graphql";

// * Helper
import getParamFromResponse from "helpers/discord/getParamFromResponse";

// * Types
import { Command } from "types";

// * Constants
const QUESTION_TITLE = "🗑️ Suppression d'une faction";
const NAME_QUESTION = "Quel est le nom de la faction à supprimer ?";

const RemoveFactionCommand: Command = {
  name: "removeFaction",
  aliases: ["rf", "rmFaction"],
  usage: "",
  description: "Supprimes une faction",
  onlyStaff: true,
  run: (message: Message) => runRemoveFaction(message)
};

const runRemoveFaction = async (message: Message) => {
  const embed: RichEmbed = new RichEmbed();
  const name = await getParamFromResponse(
    message,
    QUESTION_TITLE,
    NAME_QUESTION,
    60000
  );

  const { data, errors } = await client.mutate<
    RemoveFactionMutation,
    RemoveFactionMutationVariables
  >({
    mutation: removeFaction,
    variables: { name },
    errorPolicy: "all"
  });

  if (data?.removeFaction) {
    embed
      .setTitle("🎉 Félicitations !")
      .setColor("GREEN")
      .setDescription(`La faction ${name} a bien été suprimée.`);
  }

  if (errors) {
    errors.forEach((error: any) => {
      switch (error.extensions.code) {
        case "CANNOT_FIND_FACTION":
          embed
            .setColor("RED")
            .setTitle(":rotating_light: Suppression impossible !")
            .setDescription(`La faction ${name} n'existe pas.`);
          break;
        default:
          embed
            .setColor("RED")
            .setTitle(":rotating_light: Erreur innatendue !")
            .setDescription(`Merci de contact le Staff.`);
          break;
      }
    });
  }

  message.channel.send(embed);
};

export default RemoveFactionCommand;
