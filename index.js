/* -------------------------
[File Information]
Author: Mystichunterz#1922
------------------------- */

console.log("----------------------");
console.log("index.js");
console.log("----------------------");

//----------------------
//  imports
//----------------------
import { GatewayIntentBits, Partials } from "discord.js";
import "dotenv/config";
import Bot from "./classes/Bot.js";

import botConfig from "./config/bot_config.js";

//----------------------
//  config
//----------------------
const prefixConfig = botConfig.botConfig.find(config => config.name === "prefix");
const botPrefix = prefixConfig ? prefixConfig.id : "!";

const client = new Bot({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  prefix: botPrefix,
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const errorChannelID = '1078481151351590974';

//----------------------
//  main
//----------------------
client.on("messageCreate", (message) => {
  if (message.content == "Hello!") {
    message.reply("hi");
  }
});

client.on('error', (error) => {
  const channel = client.channels.cache.get(errorChannelID);
  if (channel) {
    channel.send(`Vennessa has encountered an error: ${error.message}`);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options, member } = interaction;
  const roleId = '1237223748420243467'; // Replace with the actual role ID

  if (commandName === 'speak') {
    // Check if the member has the specified role
    if (!member.roles.cache.has(roleId)) {
      await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      return;
    }

    const message = options.getString('message');
    await interaction.reply({ content: 'Sending message: ' + message, ephemeral: true });
    await interaction.channel.send(message);
  }
});

client.start(process.env.TOKEN);
