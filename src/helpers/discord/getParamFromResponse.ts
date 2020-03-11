import {
  Message,
  RichEmbed,
  MessageReaction,
  User,
  Collection
} from "discord.js";
import moment from "moment";

const getParamFromResponse = async (
  message: Message,
  title: string,
  question: string,
  time: number,
  optional = false
): Promise<string> =>
  new Promise(async resolve => {
    const { channel, author } = message;

    const displayTime = moment.duration(time, "ms").asMinutes();

    const embed: RichEmbed = new RichEmbed()
      .setTitle(title)
      .setDescription(question)
      .setFooter(`Vous avez ${displayTime}min pour répondre`)
      .setColor("GOLD");

    const sentMessage = (await channel.send(embed)) as Message;

    if (optional) {
      const noEmoji = message.guild.emojis.find(emoji => emoji.name === "no");

      sentMessage.react(noEmoji);

      const filter = (reaction: MessageReaction, user: User) => {
        return reaction.emoji === noEmoji && user.id === message.author.id;
      };

      sentMessage.awaitReactions(filter, { max: 1 }).then(() => {
        sentMessage.clearReactions();
        resolve();
      });
    }

    channel
      .awaitMessages(m => m.author.id === author.id, {
        max: 1,
        time
      })
      .then((collected: Collection<string, Message>) => {
        sentMessage.clearReactions();
        if (collected.first()) resolve(collected.first().content);
      });
  });

export default getParamFromResponse;
