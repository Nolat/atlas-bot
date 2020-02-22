// * Types
import { GuildMember } from "discord.js";

const isMemberStaff = (member: GuildMember): boolean => {
  return !!member.roles.find(role => role.name.includes("Staff"));
};

export default isMemberStaff;
