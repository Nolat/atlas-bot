import { Message, RichEmbed } from "discord.js";

// * GraphQL
import client from "graphql/client";

import userFaction from "graphql/user/queries/userFaction";

import faction from "graphql/faction/queries/faction";

import giveUserExperience from "graphql/client/experience/mutations/giveUserExperience";

import {
  FactionQuery,
  FactionQueryVariables,
  GiveUserExperienceMutation,
  GiveUserExperienceMutationVariables,
  UserFactionQuery,
  UserFactionQueryVariables
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
  "Dans quelle faction voulez-vous que le(s) joueur(s) reçoive(nt) l'expérience ? (Optionnel, si non précisé, l'expérience sera affectée à la faction actuelle de chaque membre)";
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
    let factionName = await askFactionName(message);

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
      let factionError = false;

      if (!factionName) {
        const { data } = await client.query<
          UserFactionQuery,
          UserFactionQueryVariables
        >({
          query: userFaction,
          variables: { id },
          errorPolicy: "all"
        });

        if (data.user.faction) factionName = data.user.faction.name;
        else {
          embed
            .setColor("RED")
            .setTitle(":rotating_light: Erreur!")
            .setDescription(`${user} n'est pas dans une faction.`);

          factionError = true;
        }
      }

      if (!factionError) {
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

    if (error.message.includes("USER_NOT_IN_FACTION")) {
      embed
        .setColor("RED")
        .setTitle(":rotating_light: Ajout impossible !")
        .setDescription(`${message.author} n'est pas membre d'une Faction.`);
    }
  }
};

const askFactionName = async (message: Message): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const name = await getParamFromResponse(
      message,
      QUESTION_TITLE,
      FACTION_QUESTION,
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

      if (!errors) resolve(name);
      reject(new Error(`FACTION_DOESNT_EXIST:${name}`));
    } else resolve();
  });
};

export default addExperienceCommand;
