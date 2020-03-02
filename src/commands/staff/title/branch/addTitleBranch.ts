import { Message, RichEmbed } from "discord.js";

// * GraphQL
import client from "graphql/client";

import faction from "graphql/faction/queries/faction";

import titleBranch from "graphql/titleBranch/queries/titleBranch";

import addTitleBranch from "graphql/titleBranch/mutations/addTitleBranch";

import {
  AddTitleBranchMutation,
  AddTitleBranchMutationVariables,
  FactionQuery,
  FactionQueryVariables,
  TitleBranchQuery,
  TitleBranchQueryVariables
} from "generated/graphql";

// * Helper
import getParamFromResponse from "helpers/discord/getParamFromResponse";

// * Types
import { Command } from "types";

// * Constants
const QUESTION_TITLE = ":pencil: Ajout d'une branche";
const NAME_QUESTION = "Quel nom souhaitez-vous pour cette branche ?";
const FACTION_NAME_QUESTION =
  "A quel faction souhaitez-vous assigner cette brache ?";

const AddTitleBranchCommand: Command = {
  name: "addBranch",
  aliases: ["ab"],
  usage: "",
  description: "Ajoute une branche de titre",
  onlyStaff: true,
  run: (message: Message) => runAddTitleBranch(message)
};

const runAddTitleBranch = async (message: Message) => {
  const embed: RichEmbed = new RichEmbed();

  try {
    const name = await askBranchName(message);

    const factionName = await askFactionName(message);

    const { data, errors } = await client.mutate<
      AddTitleBranchMutation,
      AddTitleBranchMutationVariables
    >({
      mutation: addTitleBranch,
      variables: {
        name,
        factionName
      },
      errorPolicy: "all"
    });

    if (data?.addTitleBranch) {
      embed
        .setTitle("🎉 Félicitations !")
        .setColor("GREEN")
        .setDescription(`La branche ${name} a bien été créée.`);
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
    if (error.message.includes("BRANCH_ALREADY_EXIST")) {
      const arg = error.message.split(":")[1];
      embed
        .setColor("RED")
        .setTitle(":rotating_light: Ajout impossible !")
        .setDescription(`La brannche ${arg} existe déjà.`);
    }

    if (error.message.includes("FACTION_DOESNT_EXIST")) {
      const arg = error.message.split(":")[1];
      embed
        .setColor("RED")
        .setTitle(":rotating_light: Ajout impossible !")
        .setDescription(`La faction ${arg} n'existe pas.`);
    }
  }

  message.channel.send(embed);
};

const askBranchName = async (message: Message): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const name = await getParamFromResponse(
      message,
      QUESTION_TITLE,
      NAME_QUESTION,
      60000
    );

    const { errors } = await client.query<
      TitleBranchQuery,
      TitleBranchQueryVariables
    >({
      query: titleBranch,
      variables: { name },
      errorPolicy: "all"
    });

    if (errors) resolve(name);
    reject(new Error(`BRANCH_ALREADY_EXIST:${name}`));
  });
};

const askFactionName = async (message: Message): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const name = await getParamFromResponse(
      message,
      QUESTION_TITLE,
      FACTION_NAME_QUESTION,
      60000
    );

    const { errors } = await client.query<FactionQuery, FactionQueryVariables>({
      query: faction,
      variables: { name },
      errorPolicy: "all"
    });

    if (errors) reject(new Error(`FACTION_DOESNT_EXIST:${name}`));
    resolve(name);
  });
};

export default AddTitleBranchCommand;
