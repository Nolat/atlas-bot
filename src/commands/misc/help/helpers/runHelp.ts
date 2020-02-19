import { Message } from "discord.js";

// * Helpers
import getHelpForCommands from "./getHelpForCommands";
import getHelpForAllCommands from "./getHelpForAllCommands";

const runHelp = (message: Message, isStaff = false) => {
  const params = message.content.split(" ");
  params.shift();

  const embed = params.length
    ? getHelpForCommands(params, isStaff)
    : getHelpForAllCommands(isStaff);

  if (embed) {
    if (isStaff) {
      message.author.send(embed);
    } else {
      message.channel.send(embed);
    }
  }
};

export default runHelp;
