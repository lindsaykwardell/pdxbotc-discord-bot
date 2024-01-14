import { REST, Routes, SlashCommandOptionsOnlyBuilder } from "discord.js";

export enum CommandName {
  Ping = "ping",
  UpdateRegisterLink = "update-register-link",
}

export const registerCommands = async () => {
  const commands = [
    {
      name: CommandName.Ping,
      description: "Replies with Pong!",
    },
    {
      name: CommandName.UpdateRegisterLink,
      description: "Updates the register link for events.",
      options: [
        {
          name: "event",
          description: "The event to update the register link for.",
          type: 3,
          choices: [
            {
              name: "TPK Brewing",
              value: "tpk",
            },
            {
              name: "Red Castle Games",
              value: "rcg",
            },
          ],
          required: true,
        },
        {
          name: "link",
          description: "The new register link.",
          type: 3,
          required: true,
        },
      ],
    },
  ];

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};
