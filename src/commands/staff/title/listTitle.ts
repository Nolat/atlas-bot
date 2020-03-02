import { Message, RichEmbed, MessageReaction, User } from "discord.js";

// * Types
import { Command } from "types";

// * GraphQL
import client from "graphql/client";

import titles from "graphql/title/queries/titles";

import {
  TitleBranch,
  TitlesQuery,
  TitlesQueryVariables,
  Maybe,
  Faction,
  Title
} from "generated/graphql";

// * Helpers
import getParamFromResponse from "helpers/discord/getParamFromResponse";

// * Constants
const QUESTION_TITLE = ":memo: Liste des titres";
const FACTION_QUESTION =
  "Pour quelle faction souhaitez-vous lister les titres ? (Optionnel)";

// * Interface & Type
type PageTitle = { __typename?: "Title" } & Pick<
  Title,
  "id" | "name" | "level"
> & {
    parent: Maybe<{ __typename?: "Title" } & Pick<Title, "id" | "name">>;
    faction: Maybe<{ __typename?: "Faction" } & Pick<Faction, "name">>;
    branch: Maybe<{ __typename?: "TitleBranch" } & Pick<TitleBranch, "name">>;
  };

interface Page {
  name: string;
  titles: Array<PageTitle>;
}

const ListTitleCommand: Command = {
  name: "listTitle",
  aliases: ["lt"],
  usage: "",
  description: "Liste les titres disponibles",
  onlyStaff: true,
  run: (message: Message) => runListTitle(message)
};

const runListTitle = async (message: Message) => {
  const factionName = await getParamFromResponse(
    message,
    QUESTION_TITLE,
    FACTION_QUESTION,
    60000,
    true
  );

  const { data, errors } = await client.query<
    TitlesQuery,
    TitlesQueryVariables
  >({
    query: titles,
    variables: { factionName },
    fetchPolicy: "network-only",
    errorPolicy: "all"
  });

  if (data) {
    const factionList = data.titles
      .map(title => title.faction?.name || "Autre")
      .filter((name, pos, arr) => arr.indexOf(name) === pos);

    const pages: Page[] = factionList.map(faction => {
      const factionTitles = data.titles.filter(
        title =>
          title.faction?.name === faction ||
          (!title.faction && faction === "Autre")
      );
      return {
        name: faction,
        titles: factionTitles
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
  pages: Page[],
  pageId: number
) => {
  const sentMessage = (await message.channel.send(
    buildTitleListPage(pages[pageId])
  )) as Message;

  buildPageReaction(message.author, sentMessage, pages, pageId);
};

const buildTitleListPage = (page: Page): RichEmbed => {
  const embed = new RichEmbed();
  embed.setColor("GOLD");
  embed.setTitle(`:memo: Liste des titres - ${page.name}`);

  page.titles.forEach((title: PageTitle) => {
    let fieldTitle = "";

    if (title.branch) fieldTitle += `${title.branch.name} - `;
    if (title.level) fieldTitle += `Niveau ${title.level}`;
    else fieldTitle += "Hors Niveau";

    embed.addField(fieldTitle, title.name);
  });

  return embed;
};

const buildPageReaction = async (
  author: User,
  message: Message,
  pages: Page[],
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

    message.edit(buildTitleListPage(pages[newId]));
    buildPageReaction(author, message, pages, newId);
  });
};

export default ListTitleCommand;
