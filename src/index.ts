import "reflect-metadata";
import "cross-fetch/polyfill";

// * CommandHandler
import { CommandHandler } from "utils/commandHandler";

// * Discord client
import client from "utils/discordClient/client";

const initApp = () => {
  // * Create new command handler
  const commandHandler = new CommandHandler("src/commands/");

  // * Initialize commandHandler
  // * -> Import all commands
  commandHandler.init();

  // * Start Discord client
  client.start(commandHandler);
  console.log(`🤖 Discord client is online.`);
};

initApp();
