import { Guild, GuildMember, TextChannel } from "discord.js";
import moment from "moment";

// * Environment variables
const JOIN_LEAVE_CHANNEL_ID: string = process.env.JOIN_LEAVE_CHANNEL_ID!;

const sendLeaveMessage = async (server: Guild, member: GuildMember) => {
  const joinleaveChannel: TextChannel = server.channels.find(
    channel => channel.id === JOIN_LEAVE_CHANNEL_ID && channel.type === "text"
  ) as TextChannel;

  const months = moment().diff(member.joinedTimestamp, "months");
  const days = moment().diff(member.joinedTimestamp, "days");

  let message = `${member.user.toString()} a quitté le serveur.`;
  if (months > 0) {
    message += ` Il a été avec nous ${months} mois et ${days} jours.`;
  }

  joinleaveChannel.send(message);
};

export default sendLeaveMessage;
