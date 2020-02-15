import { CommandHandler } from "utils/commandHandler";
import client from "./client";

const initDiscordClient = () => {
  // * Create new command handler
  const commandHandler = new CommandHandler("src/commands/");

  // * Initialize commandHandler
  // * -> Import all commands
  commandHandler.init();

  // * Start Discord client
  client.start(commandHandler);
  console.log(`🤖 Discord client is online.`);
};

export default initDiscordClient;
