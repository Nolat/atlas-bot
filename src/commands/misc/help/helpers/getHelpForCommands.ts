import { RichEmbed } from "discord.js";

// * Discord client -> Command handler
import { client } from "utils/discordClient";

// * Environment variables
const COMMAND_PREFIX: string = process.env.COMMAND_PREFIX!;

const getHelpForCommands = (
  aliases: string[],
  isStaff = false
): RichEmbed | undefined => {
  const embed = new RichEmbed().setTitle("Aide aux commandes").setColor("GOLD");
  const commands = aliases.map(alias =>
    client.COMMAND_HANDLER.getCommandFromAlias(alias)
  );

  const filteredCommands = commands.filter(
    command => command?.onlyStaff === isStaff
  );

  // * Check if their is only undefined command
  if (filteredCommands.every(command => !command)) return undefined;

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

export default getHelpForCommands;
