import { Message } from "discord.js";

// * Types
import { Command } from "types";

// * Helpers
import runHelp from "./helpers/runHelp";

const HelpStaffCommand: Command = {
  name: "helpStaff",
  aliases: ["hs", "aideStaff"],
  usage: "[nomDeCommande]",
  description:
    "Affiche la description d'une ou plusieurs commandes disponible pour le Staff",
  onlyStaff: true,
  run: (message: Message) => runHelp(message, true)
};

export default HelpStaffCommand;
