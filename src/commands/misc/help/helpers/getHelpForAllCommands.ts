import { RichEmbed } from "discord.js";

// * Types
import { CommandInArray } from "types";

// * Discord client -> Command handler
import { client } from "utils/discordClient";

// * Environment variables
const { COMMAND_PREFIX } = process.env;

const getHelpForAllCommands = (isStaff = false): RichEmbed => {
  const embed = new RichEmbed().setTitle("Aide aux commandes").setColor("GOLD");
  const uniqueCommandsArray = client.COMMAND_HANDLER.getAllUniqueCommands();

  const filteredUniqueCommandsArray = uniqueCommandsArray.filter(
    command => command.command.onlyStaff === isStaff
  );

  filteredUniqueCommandsArray.forEach((param: CommandInArray) => {
    embed.addField(
      `${COMMAND_PREFIX}${param.alias} ${param.command.usage}`,
      param.command.description
    );
  });

  return embed;
};

export default getHelpForAllCommands;
