import { Message } from "discord.js";

// * Types
import { Command } from "types";

// * Helpers
import runHelp from "./helpers/runHelp";

const HelpCommand: Command = {
  name: "help",
  aliases: ["h", "aide"],
  usage: "[nomDeCommande]",
  description: "Affiche la description d'une ou plusieurs commandes",
  onlyStaff: false,
  run: (message: Message) => runHelp(message)
};

export default HelpCommand;
