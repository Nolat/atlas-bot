import { Message, RichEmbed, MessageMentions } from "discord.js";
import moment from "moment";

const getMentionsFromResponse = async (
  message: Message,
  title: string,
  question: string,
  time: number
): Promise<MessageMentions> => {
  const { channel, author } = message;

  const displayTime = moment.duration(time, "ms").asMinutes();

  const embed: RichEmbed = new RichEmbed()
    .setTitle(title)
    .setDescription(question)
    .setFooter(`Vous avez ${displayTime}min pour répondre`)
    .setColor("GOLD");

  await channel.send(embed);

  const collected = await channel.awaitMessages(
    m => m.author.id === author.id,
    {
      max: 1,
      time
    }
  );

  return collected.first().mentions;
};

export default getMentionsFromResponse;
