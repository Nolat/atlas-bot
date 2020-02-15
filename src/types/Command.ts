import { Message } from "discord.js";

export default interface Command {
  name: string;
  aliases: string[];
  usage: string;
  description: string;
  onlyStaff: boolean;
  run(message: Message): void;
}
