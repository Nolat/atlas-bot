import { Message } from "discord.js";

// * GraphQL client
import client from "graphql/client";

// * GraphQL Queries
import titleBranch from "graphql/titleBranch/queries/titleBranch";

// * GraphQL Types
import { TitleBranchQuery, TitleBranchQueryVariables } from "generated/graphql";

// * Helpers
import getParamFromResponse from "helpers/discord/getParamFromResponse";

const askBranchName = async (
  message: Message,
  QUESTION_TITLE: string,
  NAME_QUESTION: string,
  time: number,
  optional = false,
  newBranch = false
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
        TitleBranchQuery,
        TitleBranchQueryVariables
      >({
        query: titleBranch,
        variables: { name },
        errorPolicy: "all"
      });

      if (newBranch) {
        if (errors) resolve(name);
        reject(new Error(`BRANCH_ALREADY_EXIST:${name}`));
      } else {
        if (data.titleBranch) resolve(name);
        reject(new Error(`BRANCH_DOESNT_EXIST:${name}`));
      }
    }
  });
};

export default askBranchName;
