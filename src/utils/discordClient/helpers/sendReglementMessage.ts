import { Guild, Message, RichEmbed, TextChannel } from "discord.js";

// * Environment variables
const REGLEMENT_CHANNEL_ID: string = process.env.REGLEMENT_CHANNEL_ID!;
const REGLEMENT_MESSAGE_ID: string = process.env.REGLEMENT_MESSAGE_ID!;

const sendReglementMessage = async (server: Guild) => {
  const embed = new RichEmbed();

  embed
    .setColor("#f9ca24")
    .setTitle("Règlement")
    .addField(
      "Règle 1 - Vie de la communauté",
      "Les propos injurieux, racistes, sexistes, discriminatoires et à caractères pornographiques sont interdits. Les messages politiques ou religieux sont également à éviter."
    )
    .addField(
      "Règle 2 - Comportement des membres",
      "Toute plaisanterie trop insistante sera sanctionnée. Le spam/flood de messages est interdit."
    )
    .addField(
      "Règle 3 - Pseudos & Images de profils",
      "Le Staff se laisse la liberté de modifier les pseudos de certains membres dans différents cas (obscénité, caractères spéciaux, etc.).\n\nDe même, les images de profils à caractère obscène sont interdites et pourront faire l'objet d'une sanction."
    )
    .addField(
      "Règles 4 - Ventes",
      "Edell n'est pas un site de vente ou d'enchères, la vente de compte est donc interdite."
    )
    .addField(
      "Règles 5 - Promotions",
      "Toute demande de promotion sera ignorée. Les promotions se font au mérite et uniquement sur décision du Staff."
    )
    .addField(
      "Règles 6 - Publicité/Recrutement",
      "Le recrutement et la publicité pour d'autres structures et serveurs sont strictement interdites. La diffusion d'autres liens et images sont autorisées."
    )
    .addField(
      "Règles 7 - Sanctions",
      "Toute sanction est donnée avec un motif. Vous pouvez évidemment contester la décision en envoyant une demande, le Staff se penchera alors plus en détails sur votre cas."
    )
    .addField(
      "Règle 8 - Politesse",
      "Ni un **bonjour**, ni un **au revoir**, n'ont jamais tué personne. Nous vous demandons donc de faire preuve d'un minimum de politesse."
    );

  const reglementChannel: TextChannel = server.channels.find(
    channel => channel.id === REGLEMENT_CHANNEL_ID && channel.type === "text"
  ) as TextChannel;

  try {
    const reglementMessage: Message = await reglementChannel.fetchMessage(
      REGLEMENT_MESSAGE_ID
    );

    reglementMessage.edit({ embed });
  } catch (error) {
    reglementChannel.send({ embed });
  }
};

export default sendReglementMessage;
