import "reflect-metadata";
import "cross-fetch/polyfill";

// * Utils
import { initDiscordClient } from "utils/discord";

const setupBot = async () => {
  await initDiscordClient();
};

setupBot();
