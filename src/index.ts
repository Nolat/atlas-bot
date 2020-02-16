import "reflect-metadata";
import "cross-fetch/polyfill";
import "lib/env";
import express from "express";

// * CommandHandler
import { CommandHandler } from "utils/commandHandler";

// * Discord client
import { client } from "utils/discordClient";

// * Environment variables
const PORT: number = parseInt(process.env.PORT!, 10);

const initApp = () => {
  // * Create new command handler
  const commandHandler = new CommandHandler("src/commands/");

  // * Initialize commandHandler
  // * -> Import all commands
  commandHandler.init();

  // * Start Discord client
  client.start(commandHandler);
  console.log(`🤖 Discord client is online.`);

  // * Create express app
  const app = express();

  // * Boot server
  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}`)
  );
};

initApp();
