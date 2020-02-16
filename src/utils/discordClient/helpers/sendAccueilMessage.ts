import { Guild, Message, RichEmbed, TextChannel } from "discord.js";

// * Load environment variables
import "lib/env";

const ACCUEIL_CHANNEL_ID: string = process.env.ACCUEIL_CHANNEL_ID!;
const ACCUEIL_MESSAGE_ID: string = process.env.ACCUEIL_MESSAGE_ID!;

const sendAccueilMessage = async (server: Guild) => {
  const embed = new RichEmbed();

  embed
    .setColor("#f9ca24")
    .setTitle(":tada: Bienvenue")
    .setDescription(
      "Bienvenue cher joueur/joueuse sur Edell, un monde virtuel occupé par 3 factions en guerre, " +
        "défendant chacun leurs idéaux. (Plus d’informations dans #factions)." +
        "\n\nEdell est un monde particulier, où de nombreux univers se retrouvent, ainsi, les factions " +
        "s’affrontent dans divers monde allant d’Overwatch à Counter-Strike en passant par Minecraft et " +
        "bien d’autres…" +
        "\n\nSoit guidé(e) par Atlas, une IA créée pour vous guider dans ce monde, et rejoins ta faction " +
        "pour prendre part au conflit sur Edell." +
        "\n\n\n⚠️ Le monde d'Edell n'étant pas encore achevé, beaucoup de ses possibilités ne sont pas " +
        "encore accessibles."
    );

  const accueilChannel: TextChannel = server.channels.find(
    channel => channel.id === ACCUEIL_CHANNEL_ID && channel.type === "text"
  ) as TextChannel;

  try {
    const accueilMessage: Message = await accueilChannel.fetchMessage(
      ACCUEIL_MESSAGE_ID
    );

    accueilMessage.edit({ embed });
  } catch (error) {
    accueilChannel.send({ embed });
  }
};

export default sendAccueilMessage;
