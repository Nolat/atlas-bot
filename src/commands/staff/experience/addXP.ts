import { Message, RichEmbed } from "discord.js";

// * GraphQL
import client from "graphql/client";

import faction from "graphql/faction/queries/faction";

import giveUserExperience from "graphql/faction/mutations/giveUserExperience";

import {
  FactionQuery,
  FactionQueryVariables,
  GiveUserExperienceMutation,
  GiveUserExperienceMutationVariables
} from "generated/graphql";

// * Helpers
import getMentionsFromResponse from "helpers/discord/getMentionsFromResponse";
import getParamFromResponse from "helpers/discord/getParamFromResponse";

// * Types
import { Command } from "types";

// * Constants
const QUESTION_TITLE = ":sparkles: Ajout d'expérience";
const USER_QUESTION =
  "À quel(s) joueur(s) voulez-vous ajouter de l'expérience ?";
const FACTION_QUESTION =
  "Dans quelle faction voulez-vous que le(s) joueur(s) reçoive(nt) l'expérience ?";
const AMOUNT_QUESTION = "Combien de points d'expérience voulez-vous ajouter ?";

const addExperienceCommand: Command = {
  name: "addXP",
  aliases: ["axp"],
  usage: "",
  description: "Ajoute de l'expérience à un ou plusieurs joueur(s)",
  onlyStaff: true,
  run: (message: Message) => runAddXP(message)
};

const runAddXP = async (message: Message) => {
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

  try {
    const factionName = await askFactionName(message);

    const experience = Number(
      await getParamFromResponse(
        message,
        QUESTION_TITLE,
        AMOUNT_QUESTION,
        60000
      )
    );

    mentions.users.forEach(async user => {
      const { id } = user;

      const { data, errors } = await client.mutate<
        GiveUserExperienceMutation,
        GiveUserExperienceMutationVariables
      >({
        mutation: giveUserExperience,
        variables: { factionName, id, experience },
        errorPolicy: "all"
      });

      if (data?.giveUserExperience) {
        embed
          .setTitle("🎉 Félicitations !")
          .setColor("GREEN")
          .setDescription(
            `${user.toString()} a reçu ${experience} point(s) d'expérience chez ${factionName}.`
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
  } catch (error) {
    if (error.message.includes("FACTION_DOESNT_EXIST")) {
      const arg = error.message.split(":")[1];
      embed
        .setColor("RED")
        .setTitle(":rotating_light: Ajout impossible !")
        .setDescription(`La faction ${arg} n'existe pas.`);
    }

    message.channel.send(embed);
  }
};

const askFactionName = async (message: Message): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const name = await getParamFromResponse(
      message,
      QUESTION_TITLE,
      FACTION_QUESTION,
      60000
    );

    const { errors } = await client.query<FactionQuery, FactionQueryVariables>({
      query: faction,
      variables: { name },
      errorPolicy: "all"
    });

    if (!errors) resolve(name);
    reject(new Error(`FACTION_DOESNT_EXIST:${name}`));
  });
};

export default addExperienceCommand;
