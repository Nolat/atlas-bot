  import {
    Collection,
    Emoji,
    Message,
    MessageReaction,
    RichEmbed,
    User
  } from "discord.js";
  import moment from "moment";

  // * Types
  import { Command } from "types";

  // * Constants
  import { NUMBER_DAY_BEFORE_SWITCH_FACTION } from "utils/globalVariables";

  // * GraphQL client
  import client from "graphql/client";

  // * GraphQL Queries
  import userFaction from "graphql/user/queries/userFaction";
  import factions from "graphql/faction/queries/factions";

  // * GraphQL Types
  import {
    FactionsQuery,
    FactionsQueryVariables,
    UserFactionQuery,
    UserFactionQueryVariables,
    Faction,
    SetUserFactionMutation,
    SetUserFactionMutationVariables,
    UnsetUserFactionMutation,
    UnsetUserFactionMutationVariables
  } from "generated/graphql";
  import setUserFaction from "graphql/user/mutation/setUserFaction";
  import unsetUserFaction from "graphql/user/mutation/unsetUserFaction";

  const JoinCommand: Command = {
    name: "join",
    aliases: ["j"],
    usage: "",
    description:
      "Permet de rejoindre une des 3 factions ou d'en changer après une semaine",
    onlyStaff: false,
    run: (message: Message) => runJoin(message)
  };

  const runJoin = async (message: Message) => {
    const embed: RichEmbed = new RichEmbed();
    const user: User = message.author;
    const userId: string = user.id;

    const { data } = await client.query<
      UserFactionQuery,
      UserFactionQueryVariables
    >({
      query: userFaction,
      variables: { userId }
    });

    // With faction
    if (data?.user.faction) {
      const daysSinceJoined = moment
        .unix(Number(data?.user.joinedFactionAt))
        .diff(moment(), "days");

      if (daysSinceJoined > 7) {
        await buildText(embed, data.user.faction.name);
      } else {
        embed
          .setColor("RED")
          .setDescription(
            `Tu as rejoins une faction il y a moins de ${NUMBER_DAY_BEFORE_SWITCH_FACTION}, tu dois encore attendre avant de changer!`
          );
      }

      // Without faction
    } else {
      await buildText(embed);
    }

    await sendMessageAndGetReact(message, embed);
  };

  const buildText = async (
    embed: RichEmbed,
    currentFactionName: string | undefined = undefined
  ) => {
    const text =
      "**Choisis ta faction que possède Edell parmis les suivantes :**\n";
    const { data } = await client.query<FactionsQuery, FactionsQueryVariables>({
      query: factions
    });

    if (data?.factions) {
      data.factions.forEach((faction) => {
        console.log(faction.name);

        if (faction.name !== currentFactionName) {
          text.concat(`\nLa faction **${faction.name}**, actuellement il y a ${
            faction.memberCount
          } membres sur les ${faction.maxMember} possible.\n
                  Sont recrutement est ${
                    faction.isJoinable ? "ouvert" : "fermer"
                  } pour le moment.\n
                  Voici une description rapide de cette faction :\n
                  ${faction.description}\n
                  Sont icône est ${
                    faction.icon
                  } clique dessus pour la choisir !\n`);
        }
      });
      embed.setDescription(text);
    } else throw new Error("No faction");
  };

  const sendMessageAndGetReact = async (message: Message, embed: RichEmbed, currentFactionName: string | undefined = undefined) => {
    const choiceFactionMessage: Message | Message[] = await message.channel.send(
      embed
    );
    const { data } = await client.query<FactionsQuery, FactionsQueryVariables>({
      query: factions
    });
    const emojiListName: string[] = [];

    data.factions.forEach((faction) => {
      console.log("SendMessageAndGetReact : ");
      console.log(faction.name);
      if(!currentFactionName || currentFactionName !== faction.name) emojiListName.push(
        message.guild.emojis.find((emoji: Emoji) => emoji.name === faction.icon)
          .name
      );
    });

    if (choiceFactionMessage instanceof Message) {
      emojiListName.forEach(name => choiceFactionMessage.react(name));

      const filter = (reaction: MessageReaction, user: User) => {
        return (
          emojiListName.includes(reaction.emoji.name) &&
          user.id === message.author.id
        );
      };

      choiceFactionMessage
        .awaitReactions(filter, { max: 2 })
        .then(async (collected: Collection<string, MessageReaction>) => {
          getResponseAndSetFaction(message.author.id, collected,data.factions, currentFactionName);
        });
    }
  };

  const getResponseAndSetFaction = async (
      userId: string,
      collected: Collection<string, MessageReaction>,
      factionList: Array<{ __typename?: "Faction" } & Pick<Faction, "id" | "description" | "name" | "memberCount" | "maxMember" | "isJoinable" | "icon">>,
      currentFactionName: string | undefined = undefined
  ) => {
    const awnser = collected.find("count", 2).emoji.name;

      const factionName: string = factionList.find((fac) => fac.icon === awnser )!.name;

      if(currentFactionName)
        await client.mutate<UnsetUserFactionMutation,UnsetUserFactionMutationVariables>({mutation:unsetUserFaction, variables:{ id:userId}});

      await client.mutate<SetUserFactionMutation,SetUserFactionMutationVariables>({mutation: setUserFaction,variables:{factionName, id : userId}})

  };

  export default JoinCommand;