import {
  Guild,
  TextChannel,
  Message,
  Role,
  User,
  Emoji,
  MessageReaction,
  GuildMember
} from "discord.js";

// * Environment variables
const ACCUEIL_CHANNEL_ID: string = process.env.ACCUEIL_CHANNEL_ID!;
const ACCUEIL_MESSAGE_ID: string = process.env.ACCUEIL_MESSAGE_ID!;
const JOIN_LEAVE_CHANNEL_ID: string = process.env.JOIN_LEAVE_CHANNEL_ID!;
const GENERAL_CHANNEL_ID: string = process.env.GENERAL_CHANNEL_ID!;

export const awaitReactionForNewMember = async (server: Guild) => {
  const newMembers = server.members.filter(
    member => !member.roles.find(role => role.name !== "@everyone")
  );

  newMembers.forEach(member => awaitReactionAsNewMember(server, member));
};

export const awaitReactionAsNewMember = async (
  server: Guild,
  member: GuildMember
) => {
  const accueilChannel: TextChannel = server.channels.find(
    channel => channel.id === ACCUEIL_CHANNEL_ID && channel.type === "text"
  ) as TextChannel;

  const yesEmoji: Emoji = server.emojis.find(emoji => emoji.name === "yes");

  const roleJoueur: Role = server.roles.find(role =>
    role.name.includes("Joueur")
  );

  try {
    const accueilMessage: Message = await accueilChannel.fetchMessage(
      ACCUEIL_MESSAGE_ID
    );

    const filter = (reaction: MessageReaction, user: User) => {
      return reaction.emoji === yesEmoji && user.id === member.user.id;
    };

    accueilMessage.awaitReactions(filter, { max: 1 }).then(() => {
      member.addRole(roleJoueur);

      const joinleaveChannel: TextChannel = server.channels.find(
        channel =>
          channel.id === JOIN_LEAVE_CHANNEL_ID && channel.type === "text"
      ) as TextChannel;

      joinleaveChannel.send(`${member.user.toString()} est devenu Joueur.`);

      const generalChannel: TextChannel = server.channels.find(
        channel => channel.id === GENERAL_CHANNEL_ID && channel.type === "text"
      ) as TextChannel;

      generalChannel.send(
        `Un nouveau joueur viens d'apparaitre. Bienvenue à toi ${member.user.toString()}.`
      );
    });
  } catch (error) {
    console.error(error);
  }
};
