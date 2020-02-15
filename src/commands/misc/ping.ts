import { Message, RichEmbed } from "discord.js";
import moment from "moment";

// * Types
import { Command } from "types";

const PingCommand: Command = {
  name: "ping",
  aliases: ["p"],
  usage: "",
  description: "Affiche le temps de réponse du bot",
  onlyStaff: false,
  run: (message: Message) => runPing(message)
};

const runPing = (message: Message) => {
  const embed: RichEmbed = new RichEmbed();

  const time = moment().diff(message.createdTimestamp);
  embed
    .setColor("BLUE")
    .setTitle("Ping")
    .setDescription(`${time}ms`);

  message.channel.send(embed);
};

export default PingCommand;
