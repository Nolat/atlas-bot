import { Message } from "discord.js";

// * Helper
import getParamFromResponse from "helpers/discord/getParamFromResponse";

const askMoney = async (
  message: Message,
  QUESTION_TITLE: string,
  HOW_QUESTION: string
): Promise<number> => {
  const params = await getParamFromResponse(
    message,
    `${QUESTION_TITLE}`,
    HOW_QUESTION,
    60000
  );
  const values = params.split(" ");
  let money = 0;

  values.forEach(value => {
    switch (value.replace(/[0-9]/g, "")) {
      case "pp":
        money += Number(value.replace("pp", "")) * 1000000;
        break;

      case "po":
        money += Number(value.replace("po", "")) * 10000;
        break;

      case "pa":
        money += Number(value.replace("pa", "")) * 100;
        break;

      case "pc":
        money += Number(value.replace("pc", ""));
        break;

      default:
        break;
    }
  });

  return money;
};

export default askMoney;
