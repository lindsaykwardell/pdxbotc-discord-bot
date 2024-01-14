// use dotenv to load environment variables
import "dotenv/config";
import { registerCommands } from "./commands";
import { initializeClient } from "./client";

const main = async () => {
  await registerCommands();

  const client = await initializeClient();

  client.login(process.env.TOKEN);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
