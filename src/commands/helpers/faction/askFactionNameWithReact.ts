import { RichEmbed, Message, MessageReaction, User } from "discord.js";
import moment from "moment";

// * GraphQL client
import client from "graphql/client";

// * GraphQL Queries
import factions from "graphql/faction/queries/factions";

// * GraphQL Types
import { FactionsQuery, FactionsQueryVariables } from "generated/graphql";

const askFactionNameWithReact = async (
  message: Message,
  title: string,
  question: string,
  time: number,
  optional = false
): Promise<string> =>
  new Promise(async (resolve, reject) => {
    const { channel } = message;

    const { data } = await client.query<FactionsQuery, FactionsQueryVariables>({
      query: factions,
      fetchPolicy: "network-only"
    });

    const emojiList: string[] = [];

    data.factions.forEach(faction => {
      emojiList.push(faction.icon);
    });

    const displayTime = moment.duration(time, "ms").asMinutes();

    const embed: RichEmbed = new RichEmbed()
      .setTitle(title)
      .setDescription(question)
      .addField("Temps", `${displayTime}min`)
      .setColor("GOLD");

    const sentMessage = (await channel.send(embed)) as Message;

    if (optional) {
      const noEmoji = message.guild.emojis.find(emoji => emoji.name === "no");
      await sentMessage.react(noEmoji);

      const filter = (reaction: MessageReaction, user: User) => {
        return reaction.emoji === noEmoji && user.id === message.author.id;
      };

      sentMessage.awaitReactions(filter, { max: 1 }).then(() => {
        sentMessage.clearReactions();
        resolve();
      });
    }

    for (const emoji of emojiList) {
      await sentMessage.react(emoji);
    }

    const filter = (reaction: MessageReaction, user: User) => {
      return (
        emojiList.includes(reaction.emoji.name) && user.id === message.author.id
      );
    };

    sentMessage.awaitReactions(filter, { max: 1 }).then(collected => {
      sentMessage.clearReactions();

      const { emoji } = collected.first();

      if (emoji.name === "no") return resolve();

      const faction = data.factions.find(f => f.icon === emoji.name);
      if (!faction) return reject(new Error("CANNOT_FIND_FACTION"));

      return resolve(faction.name);
    });
  });

export default askFactionNameWithReact;
