import { Message } from "discord.js";

// * GraphQL client
import client from "graphql/client";

// * GraphQL Queries
import title from "graphql/title/queries/title";

// * GraphQL Types
import { TitleQuery, TitleQueryVariables } from "generated/graphql";

// * Helpers
import getParamFromResponse from "helpers/discord/getParamFromResponse";

const askTitleName = async (
  message: Message,
  QUESTION_TITLE: string,
  NAME_QUESTION: string,
  time: number,
  optional = false,
  newTitle = false
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const name = await getParamFromResponse(
      message,
      QUESTION_TITLE,
      NAME_QUESTION,
      60000,
      optional
    );

    if (!name && optional) resolve();
    else {
      const { data, errors } = await client.query<
        TitleQuery,
        TitleQueryVariables
      >({
        query: title,
        variables: { name },
        errorPolicy: "all"
      });

      if (newTitle) {
        if (errors) resolve(name);
        reject(new Error(`TITLE_ALREADY_EXIST:${name}`));
      } else {
        if (data.title) resolve(name);
        reject(new Error(`TITLE_DOESNT_EXIST:${name}`));
      }
    }
  });
};

export default askTitleName;
