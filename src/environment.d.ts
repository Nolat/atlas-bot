export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      COMMAND_PREFIX: string;
      DISCORD_TOKEN: string;
      API_ENDPOINT: string;
      API_SECRET: string;
      DISCORD_SERVER_ID: string;
      PORT: string;
    }
  }
}
