import { Message } from "discord.js";
import fs from "fs";
import recursive from "recursive-readdir";

// * Types
import { Command, CommandInArray } from "types";

// * Helpers
import isObjectCommand from "./helpers/isObjectCommand";
import isMemberStaff from "./helpers/isMemberStaff";

// * Environment variables
const { COMMAND_PREFIX } = process.env;

export default class CommandHandler {
  commandsArray: CommandInArray[];

  pathToCommandFolder: string;

  // * Constructor
  constructor(path: string) {
    this.commandsArray = [];
    this.pathToCommandFolder = fs.realpathSync(path);
  }

  // * Recursively import command
  init() {
    recursive(
      this.pathToCommandFolder,
      async (err: NodeJS.ErrnoException | null, files: string[]) => {
        files.forEach(file => this.importCommandFromFile(file));
      }
    );
  }

  // * Import command from file
  importCommandFromFile = (file: string) => {
    import(file).then(obj => {
      const def = obj.default;
      if (def) {
        // * Check if object is a command
        if (isObjectCommand(def)) this.importCommand(def);
      }
    });
  };

  // * Import command from object
  importCommand = (command: Command) => {
    const { aliases } = command;

    aliases.forEach((alias: string) => {
      const commandInArray: CommandInArray = {
        alias,
        command
      };

      this.commandsArray.push(commandInArray);
    });

    const commandInArray: CommandInArray = {
      alias: command.name,
      command
    };

    this.commandsArray.push(commandInArray);
  };

  // * Run a command for a passing Message
  checkAndRunCommand = (message: Message) => {
    const command = this.getCommandFromMessage(message);

    if (command && (!command.onlyStaff || isMemberStaff(message.member)))
      command.run(message);
  };

  // * Return a command for a passing Message
  getCommandFromMessage = (message: Message): Command | undefined => {
    if (message.content[0] !== COMMAND_PREFIX) return undefined;

    const cmd = message.content.replace(COMMAND_PREFIX, "").toLowerCase();
    const alias = cmd.split(" ")[0];

    return this.getCommandFromAlias(alias);
  };

  // * Return a command for a passing string
  getCommandFromAlias = (alias: string): Command | undefined => {
    const commandInArray = this.commandsArray.find(
      (c: CommandInArray) => c.alias.toLowerCase() === alias.toLowerCase()
    );

    if (!commandInArray) return undefined;
    return commandInArray.command;
  };

  // * Return all unique commands from the command array
  getAllUniqueCommands = (): CommandInArray[] => {
    const uniqueCommandsArray = this.commandsArray.filter(
      (c: CommandInArray) => c.alias === c.command.name
    );

    return uniqueCommandsArray;
  };
}
