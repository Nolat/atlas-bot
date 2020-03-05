import { Message } from "discord.js";

// * Helper
import getParamFromResponse from "helpers/discord/getParamFromResponse";

// * GraphQL
import client from "graphql/client";

import faction from "graphql/faction/queries/faction";

import { FactionQuery, FactionQueryVariables } from "generated/graphql";

const askFactionName = async (
  message: Message,
  QUESTION_TITLE: string,
  NAME_QUESTION: string,
  time: number,
  optional = false,
  newFaction = false
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const name = await getParamFromResponse(
      message,
      QUESTION_TITLE,
      NAME_QUESTION,
      time,
      optional
    );

    if (!name && optional) resolve();
    else {
      const { data, errors } = await client.query<
        FactionQuery,
        FactionQueryVariables
      >({
        query: faction,
        variables: { name },
        errorPolicy: "all"
      });

      if (newFaction) {
        if (errors) resolve(name);
        reject(new Error(`FACTION_ALREADY_EXIST:${name}`));
      } else {
        if (data.faction) resolve(name);
        reject(new Error(`FACTION_DOESNT_EXIST:${name}`));
      }
    }
  });
};

export default askFactionName;
