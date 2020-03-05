import { Message, RichEmbed } from "discord.js";

// * GraphQL
import client from "graphql/client";

import addTitle from "graphql/title/mutations/addTitle";

import { AddTitleMutation, AddTitleMutationVariables } from "generated/graphql";

// * Helper
import getParamFromResponse from "helpers/discord/getParamFromResponse";

// * Branch helpers
import askBranchName from "commands/helpers/title/branch/askBranchName";

// * Faction helpers
import askFactionNameWithReact from "commands/helpers/faction/askFactionNameWithReact";

// * Title helpers
import askTitleName from "commands/helpers/title/askTitleName";

// * Types
import { Command } from "types";

// * Constants
const QUESTION_TITLE = ":pencil: Ajout d'un titre";
const NAME_QUESTION = "Quel nom souhaitez-vous pour ce titre ?";
const LEVEL_QUESTION =
  "A quel niveau souhaitez-vous donner ce titre ? (Optionnel)";
const FACTION_NAME_QUESTION =
  "A quelle faction souhaitez-vous assigner ce titre ? (Optionnel)";
const BRANCH_NAME_QUESTION =
  "A quelle branche souhaitez-vous assigner ce titre ? (Optionnel)";
const PARENT_NAME_QUESTION =
  "Quel est le titre parent de ce titre ? (Optionnel)";

const AddTitleCommand: Command = {
  name: "addTitle",
  aliases: ["at"],
  usage: "",
  description: "Ajoute un titre",
  onlyStaff: true,
  run: (message: Message) => runAddTitle(message)
};

const runAddTitle = async (message: Message) => {
  const embed: RichEmbed = new RichEmbed();

  try {
    const name = await askTitleName(
      message,
      QUESTION_TITLE,
      NAME_QUESTION,
      60000,
      false,
      true
    );

    const level = Number(
      await getParamFromResponse(
        message,
        QUESTION_TITLE,
        LEVEL_QUESTION,
        60000,
        true
      )
    );

    if (level <= 0 || (Number.isNaN(level) && level))
      throw new Error("LEVEL_NOT_VALID");

    const factionName = await askFactionNameWithReact(
      message,
      QUESTION_TITLE,
      FACTION_NAME_QUESTION,
      60000
    );

    const branchName = await askBranchName(
      message,
      QUESTION_TITLE,
      BRANCH_NAME_QUESTION,
      6000,
      true
    );

    const parentName = await askTitleName(
      message,
      QUESTION_TITLE,
      PARENT_NAME_QUESTION,
      60000,
      true
    );

    const { data, errors } = await client.mutate<
      AddTitleMutation,
      AddTitleMutationVariables
    >({
      mutation: addTitle,
      variables: {
        name,
        level,
        factionName,
        branchName,
        parentName
      },
      errorPolicy: "all"
    });

    if (data?.addTitle) {
      embed
        .setTitle("🎉 Félicitations !")
        .setColor("GREEN")
        .setDescription(`Le titre ${name} a bien été créé.`);
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
    if (error.message.includes("TITLE_ALREADY_EXIST")) {
      const arg = error.message.split(":")[1];
      embed
        .setColor("RED")
        .setTitle(":rotating_light: Ajout impossible !")
        .setDescription(`Le titre ${arg} existe déjà.`);
    }

    if (error.message.includes("TITLE_DOESNT_EXIST")) {
      const arg = error.message.split(":")[1];
      embed
        .setColor("RED")
        .setTitle(":rotating_light: Ajout impossible !")
        .setDescription(`Le titre ${arg} n'existe pas.`);
    }

    if (error.message.includes("BRANCH_DOESNT_EXIST")) {
      const arg = error.message.split(":")[1];
      embed
        .setColor("RED")
        .setTitle(":rotating_light: Ajout impossible !")
        .setDescription(`La branche ${arg} n'existe pas.`);
    }

    if (error.message.includes("FACTION_DOESNT_EXIST")) {
      const arg = error.message.split(":")[1];
      embed
        .setColor("RED")
        .setTitle(":rotating_light: Ajout impossible !")
        .setDescription(`La faction ${arg} n'existe pas.`);
    }

    if (error.message.includes("LEVEL_NOT_VALID")) {
      embed
        .setColor("RED")
        .setTitle(":rotating_light: Ajout impossible !")
        .setDescription(
          `Le niveau est incorrect. Merci d'entrer un nombre supérieur à 0.`
        );
    }
  }

  message.channel.send(embed);
};

export default AddTitleCommand;
