// * Types
import { GuildMember } from "discord.js";

const isMemberStaff = (member: GuildMember): boolean => {
  return member.roles.find("name", "Staff") !== undefined;
};

export default isMemberStaff;
