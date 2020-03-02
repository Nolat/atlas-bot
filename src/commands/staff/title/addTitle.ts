import { Message, RichEmbed } from "discord.js";

// * GraphQL
import client from "graphql/client";

import faction from "graphql/faction/queries/faction";

import title from "graphql/title/queries/title";

import addTitle from "graphql/title/mutations/addTitle";

import {
  AddTitleMutation,
  AddTitleMutationVariables,
  FactionQuery,
  FactionQueryVariables,
  TitleQuery,
  TitleQueryVariables,
  TitleBranchQuery,
  TitleBranchQueryVariables
} from "generated/graphql";

// * Helper
import getParamFromResponse from "helpers/discord/getParamFromResponse";

// * Types
import { Command } from "types";
import titleBranch from "graphql/titleBranch/queries/titleBranch";

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
    const name = await askTitleName(message);

    const level = Number(
      await getParamFromResponse(
        message,
        QUESTION_TITLE,
        LEVEL_QUESTION,
        60000,
        true
      )
    );

    if (level <= 0 || Number.isNaN(level)) throw new Error("LEVEL_NOT_VALID");

    const factionName = await askFactionName(message);

    const branchName = await askBranchName(message);

    const parentName = await askParentName(message);

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

const askTitleName = async (message: Message): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const name = await getParamFromResponse(
      message,
      QUESTION_TITLE,
      NAME_QUESTION,
      60000
    );

    const { errors } = await client.query<TitleQuery, TitleQueryVariables>({
      query: title,
      variables: { name },
      errorPolicy: "all"
    });

    if (errors) resolve(name);
    reject(new Error(`TITLE_ALREADY_EXIST:${name}`));
  });
};

const askFactionName = async (message: Message): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const name = await getParamFromResponse(
      message,
      QUESTION_TITLE,
      FACTION_NAME_QUESTION,
      60000,
      true
    );

    if (name) {
      const { errors } = await client.query<
        FactionQuery,
        FactionQueryVariables
      >({
        query: faction,
        variables: { name },
        errorPolicy: "all"
      });

      if (errors) reject(new Error(`FACTION_DOESNT_EXIST:${name}`));
      resolve(name);
    } else resolve();
  });
};

const askBranchName = async (message: Message): Promise<string | undefined> => {
  return new Promise(async (resolve, reject) => {
    const name = await getParamFromResponse(
      message,
      QUESTION_TITLE,
      BRANCH_NAME_QUESTION,
      60000,
      true
    );

    if (name) {
      const { errors } = await client.query<
        TitleBranchQuery,
        TitleBranchQueryVariables
      >({
        query: titleBranch,
        variables: { name },
        errorPolicy: "all"
      });

      if (errors) reject(new Error(`BRANCH_DOESNT_EXIST:${name}`));
      resolve(name);
    } else resolve();
  });
};

const askParentName = async (message: Message): Promise<string | undefined> => {
  return new Promise(async (resolve, reject) => {
    const name = await getParamFromResponse(
      message,
      QUESTION_TITLE,
      PARENT_NAME_QUESTION,
      60000,
      true
    );

    if (name) {
      const { errors } = await client.query<TitleQuery, TitleQueryVariables>({
        query: title,
        variables: { name },
        errorPolicy: "all"
      });

      if (errors) reject(new Error(`TITLE_DOESNT_EXIST:${name}`));
      resolve(name);
    } else resolve();
  });
};

export default AddTitleCommand;
