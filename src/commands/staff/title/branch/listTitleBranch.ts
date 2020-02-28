import { Message, RichEmbed, MessageReaction, User } from "discord.js";

// * Types
import { Command } from "types";

// * GraphQL
import client from "graphql/client";

import titleBranches from "graphql/titleBranch/queries/titleBranches";

import {
  TitleBranchesQuery,
  TitleBranchesQueryVariables
} from "generated/graphql";

// * Helpers
import getParamFromResponse from "helpers/discord/getParamFromResponse";

// * Constants
const QUESTION_TITLE = ":memo: Liste des branches";
const FACTION_QUESTION =
  "Pour quelle faction souhaitez-vous lister les branches ? (Optionnel)";

const ListTitleBranchCommand: Command = {
  name: "listBranche",
  aliases: ["lb"],
  usage: "",
  description: "Liste les branches de titre disponibles",
  onlyStaff: true,
  run: (message: Message) => runListBrachTitle(message)
};

const runListBrachTitle = async (message: Message) => {
  const factionName = await getParamFromResponse(
    message,
    QUESTION_TITLE,
    FACTION_QUESTION,
    60000,
    true
  );

  const { data, errors } = await client.query<
    TitleBranchesQuery,
    TitleBranchesQueryVariables
  >({
    query: titleBranches,
    variables: { factionName },
    fetchPolicy: "network-only",
    errorPolicy: "all"
  });

  if (data) {
    const factionList = data.titleBranches.map(branch => branch.faction);
    const uniqueFactionList = factionList.filter((faction, pos, arr) => {
      return arr.map(f => f.name).indexOf(faction.name) === pos;
    });

    const pages = uniqueFactionList.map(faction => {
      const factionBranches = data.titleBranches.filter(
        branch => branch.faction.name === faction.name
      );
      return {
        name: faction.name,
        branches: factionBranches
      };
    });

    sendTitleListEmbed(message, pages, 0);
  }

  if (errors) {
    const embed = new RichEmbed();

    errors.forEach((error: any) => {
      console.log(error);
      switch (error.extensions.code) {
        case "CANNOT_FIND_FACTION":
          embed
            .setColor("RED")
            .setTitle(":rotating_light: Demande impossible !")
            .setDescription(`La faction ${factionName} n'existe pas.`);
          break;
        default:
          embed
            .setColor("RED")
            .setTitle(":rotating_light: Erreur innatendue !")
            .setDescription(`Merci de contacter le Staff.`);
          break;
      }
    });

    message.channel.send(embed);
  }
};

const sendTitleListEmbed = async (
  message: Message,
  pages: any,
  pageId: number
) => {
  const sentMessage = (await message.channel.send(
    buildBranchListPage(pages[pageId])
  )) as Message;

  buildPageReaction(message.author, sentMessage, pages, pageId);
};

const buildBranchListPage = (page: any): RichEmbed => {
  console.log(page.branches);
  const embed = new RichEmbed();
  embed.setColor("GOLD");
  embed.setTitle(`:memo: Liste des branches - ${page.name}`);
  page.branches.forEach((branch: any) =>
    embed.addField("Branche", branch.name)
  );

  return embed;
};

const buildPageReaction = async (
  author: User,
  message: Message,
  pages: any,
  pageId: number
) => {
  const emojiList: string[] = [];
  if (pages[pageId - 1]) emojiList.push("⏪");
  if (pages[pageId + 1]) emojiList.push("⏩");

  for (const emoji of emojiList) {
    await message.react(emoji);
  }

  const filter = (reaction: MessageReaction, user: User) => {
    return emojiList.includes(reaction.emoji.name) && user.id === author.id;
  };

  message.awaitReactions(filter, { max: 1 }).then(async collected => {
    await message.clearReactions();

    const newId =
      collected.first().emoji.name === "⏪" ? pageId - 1 : pageId + 1;

    message.edit(buildBranchListPage(pages[newId]));
    buildPageReaction(author, message, pages, newId);
  });
};

export default ListTitleBranchCommand;
