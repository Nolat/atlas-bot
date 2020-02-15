import { Discord, On, Client } from "@typeit/discord";
import { Message } from "discord.js";

// * Utils
import { CommandHandler } from "utils/commandHandler";

// * Load environment variables
import "lib/env";

const DISCORD_TOKEN: string = process.env.DISCORD_TOKEN!;

@Discord
export default class DiscordClient {
  private static CLIENT: Client;

  private static COMMAND_HANDLER: CommandHandler;

  static start(commandHandler: CommandHandler) {
    this.CLIENT = new Client();
    this.CLIENT.silent = true;

    this.CLIENT.login(DISCORD_TOKEN);

    this.COMMAND_HANDLER = commandHandler;
  }

  @On("message")
  async onMessage(message: Message) {
    if (DiscordClient.CLIENT.user.id !== message.author.id) {
      DiscordClient.COMMAND_HANDLER.checkAndRunCommand(message);
    }
  }
}
