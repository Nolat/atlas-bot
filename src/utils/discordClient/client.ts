import { Discord, On, Client } from "@typeit/discord";
import { Guild, Message, GuildMember } from "discord.js";

// * Utils
import { CommandHandler } from "utils/commandHandler";

// * Helpers
import {
  awaitReactionAsNewMember,
  awaitReactionForNewMember
} from "./helpers/awaitReactionForNewMember";
import sendAccueilMessage from "./helpers/sendAccueilMessage";
import sendReglementMessage from "./helpers/sendReglementMessage";
import sendJoinMessage from "./helpers/sendJoinMessage";
import sendLeaveMessage from "./helpers/sendLeaveMessage";

// * Environment variables
const DISCORD_TOKEN: string = process.env.DISCORD_TOKEN!;
const SERVER_ID: string = process.env.SERVER_ID!;

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
    awaitReactionForNewMember(server);*/
  }

  @On("message")
  async onMessage(message: Message) {
    if (DiscordClient.CLIENT.user.id !== message.author.id) {
      DiscordClient.COMMAND_HANDLER.checkAndRunCommand(message);
    }
  }

  @On("guildMemberAdd")
  async onGuildMemberAdd(member: GuildMember) {
    const server: Guild = DiscordClient.CLIENT.guilds.find(
      guild => guild.id === SERVER_ID
    );

    sendJoinMessage(server, member);
    awaitReactionAsNewMember(server, member);
  }

  @On("guildMemberRemove")
  async onGuildMemberRemove(member: GuildMember) {
    const server: Guild = DiscordClient.CLIENT.guilds.find(
      guild => guild.id === SERVER_ID
    );

    sendLeaveMessage(server, member);
  }
}
