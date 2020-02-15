import { Guild, GuildMember, TextChannel } from "discord.js";

const JOIN_LEAVE_CHANNEL_ID: string = process.env.JOIN_LEAVE_CHANNEL_ID!;

const sendJoinMessage = async (server: Guild, member: GuildMember) => {
  const joinleaveChannel: TextChannel = server.channels.find(
    channel => channel.id === JOIN_LEAVE_CHANNEL_ID && channel.type === "text"
  ) as TextChannel;

  joinleaveChannel.send(`${member.user.toString()} a rejoint le serveur.`);
};

export default sendJoinMessage;
