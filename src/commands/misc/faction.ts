import { Message, TextChannel } from "discord.js";

// * Types
import { Command } from "types";

// * Utils
import sendFactionsMessage from "utils/discordClient/helpers/sendFactionsMessage";

// * Environment variables
const FACTIONS_CHANNEL_ID = process.env.FACTIONS_CHANNEL_ID!;

const FactionCommand: Command = {
  name: "factionDescription",
  aliases: ["fd"],
  usage: "",
  description: "Rafraichi la description des factions",
  onlyStaff: true,
  run: (message: Message) => runFaction(message)
};

const runFaction = (message: Message) => {
  const factionsChannel: TextChannel = message.guild.channels.find(
    channel => channel.id === FACTIONS_CHANNEL_ID && channel.type === "text"
  ) as TextChannel;

  sendFactionsMessage(message.guild);
  message.channel.send(`${factionsChannel.toString()} actualisé.`);
};

export default FactionCommand;
