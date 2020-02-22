import { Discord, On, Client } from "@typeit/discord";
import { Message } from "discord.js";

// * Utils
import { CommandHandler } from "utils/commandHandler";

// * Environment variables
const DISCORD_TOKEN: string = process.env.DISCORD_TOKEN!;

@Discord
export default class DiscordClient {
  private static CLIENT: Client;

  public static COMMAND_HANDLER: CommandHandler;

  static start(commandHandler: CommandHandler) {
    this.CLIENT = new Client();
    this.CLIENT.silent = true;

    this.CLIENT.login(DISCORD_TOKEN);

    this.COMMAND_HANDLER = commandHandler;
  }

  @On("ready")
  async onReady() {
    const server: Guild = DiscordClient.CLIENT.guilds.find(
      guild => guild.id === SERVER_ID
    );

    /* sendAccueilMessage(server);
    sendReglementMessage(server);
    awaitReactionForNewMember(server); */
  }

  @On("message")
  async onMessage(message: Message) {
    if (
      DiscordClient.CLIENT.user.id !== message.author.id &&
      message.channel.type !== "dm"
    ) {
      DiscordClient.COMMAND_HANDLER.checkAndRunCommand(message);
    }
  }
}
