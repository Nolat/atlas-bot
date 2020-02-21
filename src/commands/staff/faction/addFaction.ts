import { Message, RichEmbed } from "discord.js";

// * GraphQL
import client from "graphql/client";

import faction from "graphql/faction/queries/faction";

import addFaction from "graphql/faction/mutations/addFaction";

import {
  FactionQuery,
  FactionQueryVariables,
  AddFactionMutation,
  AddFactionMutationVariables
} from "generated/graphql";

// * Helper
import getParamFromResponse from "helpers/discord/getParamFromResponse";

// * Types
import { Command } from "types";

// * Constants
const QUESTION_TITLE = ":pencil: Ajout d'une faction";
const NAME_QUESTION = "Quel nom souhaitez-vous pour cette faction ?";
const DESCRIPTION_QUESTION =
  "Veuillez écrire une description pour cette faction.";
const ICON_QUESTION = "Quel icône souhaitez-vous pour cette faction ?";
const COLOR_QUESTION =
  "Quelle couleur souhaitez-vous pour cette faction ? (en format hex :#ff7675)";

const AddFactionCommand: Command = {
  name: "addFaction",
  aliases: ["af"],
  usage: "",
  description: "Ajoute une faction",
  onlyStaff: true,
  run: (message: Message) => runAddFactio(message)
};

const runAddFactio = async (message: Message) => {
  const embed: RichEmbed = new RichEmbed();

  try {
    const name = await askFactionName(message);

    const description = await getParamFromResponse(
      message,
      `${QUESTION_TITLE} - ${name}`,
      DESCRIPTION_QUESTION,
      600000
    );

    const icon = await getParamFromResponse(
      message,
      `${QUESTION_TITLE} - ${name}`,
      ICON_QUESTION,
      60000
    );

    const color = await getParamFromResponse(
      message,
      `${QUESTION_TITLE} - ${name}`,
      COLOR_QUESTION,
      60000
    );

    const { data, errors } = await client.mutate<
      AddFactionMutation,
      AddFactionMutationVariables
    >({
      mutation: addFaction,
      variables: { name, description, icon, color },
      errorPolicy: "all"
    });

    if (data?.addFaction) {
      embed
        .setTitle("🎉 Félicitations !")
        .setColor("GREEN")
        .setDescription(`La faction ${name} a bien été créée.`);
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
  } catch (error) {
    if (error.message.includes("FACTION_ALREADY_EXIST")) {
      const arg = error.message.split(":")[1];
      embed
        .setColor("RED")
        .setTitle(":rotating_light: Ajout impossible !")
        .setDescription(`La faction ${arg} existe déjà.`);
    }
  }

  message.channel.send(embed);
};

const askFactionName = async (message: Message): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const name = await getParamFromResponse(
      message,
      QUESTION_TITLE,
      NAME_QUESTION,
      60000
    );

    const { errors } = await client.query<FactionQuery, FactionQueryVariables>({
      query: faction,
      variables: { name },
      errorPolicy: "all"
    });

    if (errors) resolve(name);
    reject(new Error(`FACTION_ALREADY_EXIST:${name}`));
  });
};

export default AddFactionCommand;
