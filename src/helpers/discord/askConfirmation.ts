import {
  Message,
  RichEmbed,
  MessageReaction,
  User,
  Collection,
  Emoji
} from "discord.js";

const askConfirmation = async (
  message: Message,
  embed: RichEmbed,
  acceptFunction: () => void,
  refuseFunction: () => void
) => {
  const emojiList: Emoji[] = [
    message.guild.emojis.find(emoji => emoji.name.includes("yes")),
    message.guild.emojis.find(emoji => emoji.name.includes("no"))
  ];

  const confirmationMessage: Message = (await message.channel.send(
    embed
  )) as Message;

  emojiList.forEach(emoji => {
    confirmationMessage.react(emoji);
  });

  const filter = (reaction: MessageReaction, user: User) => {
    return (
      !!emojiList.find(emoji => emoji.name === reaction.emoji.name) &&
      user.id === message.author.id
    );
  };

  confirmationMessage
    .awaitReactions(filter, { max: 1 })
    .then((collected: Collection<string, MessageReaction>) => {
      const emoji = collected.first().emoji.name;

      confirmationMessage.clearReactions();
      if (emoji === emojiList[0].name) acceptFunction();
      else refuseFunction();
    });
};

export default askConfirmation;
