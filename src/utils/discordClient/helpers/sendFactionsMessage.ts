import { Guild, Message, RichEmbed, TextChannel } from "discord.js";

// * GraphQL
import client from "graphql/client";
import { FactionsQuery, FactionsQueryVariables } from "generated/graphql";
import factions from "graphql/faction/queries/factions";

// * Environment variables
const FACTIONS_CHANNEL_ID = process.env.FACTIONS_CHANNEL_ID!;
const FACTION_MESSAGE_ID_1 = process.env.FACTION_MESSAGE_ID_1!;
const FACTION_MESSAGE_ID_2 = process.env.FACTION_MESSAGE_ID_2!;
const FACTION_MESSAGE_ID_3 = process.env.FACTION_MESSAGE_ID_3!;

const FactionsDescription = [
  FACTION_MESSAGE_ID_1,
  FACTION_MESSAGE_ID_2,
  FACTION_MESSAGE_ID_3
];

const sendFactionsMessage = async (server: Guild) => {
  // Faction Channel
  const factionsChannel: TextChannel = server.channels.find(
    channel => channel.id === FACTIONS_CHANNEL_ID && channel.type === "text"
  ) as TextChannel;

  // Factions Query
  const { data } = await client.query<FactionsQuery, FactionsQueryVariables>({
    query: factions,
    fetchPolicy: "no-cache"
  });

  console.log(data);

  data.factions.forEach(async (faction, index) => {
    // Faction Informations
    const {
      name,
      description,
      color,
      icon,
      memberCount,
      maxMember,
      isJoinable
    } = faction;

    const canJoinMessage: string = isJoinable
      ? `Vous pouvez rejoindre cette faction en utilisant la commande _join.` // TODO Ne pas hardcoder la commande, utiliser ${JoinCommand.name}
      : "Cette faction est fermée pour le moment.";

    // Embed Message
    const embed = new RichEmbed();
    embed
      .setColor(color)
      .setTitle(`${icon} ${name}`)
      .addField("Description", description)
      .addField(
        "Membres de la faction",
        `La faction possède ${memberCount} membres, avec un maximum de ${maxMember} membres.\n${canJoinMessage}`
      );

    // Faction Message
    const factionMessageID: string = FactionsDescription[index]!;

    try {
      const factionsMessage: Message = await factionsChannel.fetchMessage(
        factionMessageID
      );

      factionsMessage.edit({ embed });
    } catch (error) {
      factionsChannel.send({ embed });
    }
  });
};

export default sendFactionsMessage;
