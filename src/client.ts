import { Client, GatewayIntentBits, Events } from "discord.js";
import { CommandName } from "./commands";
import { postUpdateToGithub } from "./updateLink";

export const initializeClient = async () => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === CommandName.Ping) {
      await interaction.reply("Pong!");
    }

    if (interaction.commandName === CommandName.UpdateRegisterLink) {
      const event = interaction.options.getString("event", true) as
        | "tpk"
        | "rcg";
      const link = interaction.options.getString("link", true);

      // Verify that the user is an admin
      const isAdmin = interaction.memberPermissions.has("Administrator");

      if (!isAdmin) {
        return;
      }

      if (event !== "tpk" && event !== "rcg") {
        await interaction.reply("The event is not valid.");
        return;
      }

      // check if the link is a valid url
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      if (!urlRegex.test(link)) {
        await interaction.reply("The link is not a valid url.");
        return;
      }

      await interaction.reply(`Updating ${event} register link to ${link}...`);
      try {
        await postUpdateToGithub(event, link);
        await interaction.editReply(
          `Successfully updated ${event} register link to ${link}.`
        );
      } catch (e) {
        await interaction.editReply(
          `Failed to update ${event} register link to ${link}. Error: ${e.data.message}`
        );
        console.error(e.data);
      }
    }
  });

  return client;
};
