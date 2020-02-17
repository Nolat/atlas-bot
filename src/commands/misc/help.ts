import { Message, RichEmbed } from "discord.js";

// * Discord client -> Command handler
import { client } from "utils/discordClient";

// * Types
import { Command, CommandInArray } from "types";

// * Environment variables
const COMMAND_PREFIX: string = process.env.COMMAND_PREFIX!;

const HelpCommand: Command = {
  name: "help",
  aliases: ["h", "aide"],
  usage: "[nomDeCommande]",
  description: "Affiche la description d'une ou plusieurs commandes",
  onlyStaff: false,
  run: (message: Message) => runHelp(message)
};

const runHelp = (message: Message) => {
  const params = message.content.split(" ");
  params.shift();

  const embed = params.length
    ? getHelpForCommands(params)
    : getHelpForAllCommand();

  if (embed) message.channel.send(embed);
};

const getHelpForCommands = (aliases: string[]): RichEmbed | undefined => {
  const embed = new RichEmbed().setTitle("Aide aux commandes").setColor("GOLD");
  const commands = aliases.map(alias =>
    client.COMMAND_HANDLER.getCommandFromAlias(alias)
  );

  // * Check if their is only undefined command
  if (commands.every(command => !command)) return undefined;

  const uniqueCommands = commands.filter(
    (command, index) => commands.indexOf(command) === index
  );

  uniqueCommands.forEach(command => {
    if (command) {
      embed.addField(
        `${COMMAND_PREFIX}${command!.name} ${command!.usage}`,
        command!.description
      );
    }
  });

  return embed;
};

const getHelpForAllCommand = (): RichEmbed => {
  const embed = new RichEmbed().setTitle("Aide aux commandes").setColor("GOLD");
  const uniqueCommandsArray = client.COMMAND_HANDLER.getAllUniqueCommands();

  uniqueCommandsArray.forEach((param: CommandInArray) => {
    embed.addField(
      `${COMMAND_PREFIX}${param.alias} ${param.command.usage}`,
      param.command.description
    );
  });

  return embed;
};

export default HelpCommand;
