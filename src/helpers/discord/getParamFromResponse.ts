import { Message, RichEmbed } from "discord.js";
import moment from "moment";

const getParamFromResponse = async (
  message: Message,
  title: string,
  question: string,
  time: number
): Promise<string> => {
  const { channel, author } = message;

  const displayTime = moment.duration(time, "ms").asMinutes();

  const embed: RichEmbed = new RichEmbed()
    .setTitle(title)
    .setDescription(question)
    .addField("Temps", `${displayTime}min`)
    .setColor("GOLD");

  await channel.send(embed);

  const collected = await channel.awaitMessages(
    m => m.author.id === author.id,
    {
      max: 1,
      time
    }
  );

  return collected.first().content;
};

export default getParamFromResponse;
