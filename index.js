// A small Discord bot for testing Caster: /ping answers with the version
// of the code, and each answer is logged with the host that sent it.
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require("discord.js");
const os = require("node:os");

const VERSION = "v1";
const commands = [new SlashCommandBuilder().setName("ping").setDescription("Say which version of the bot answers").toJSON()];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function register(guild) {
  await guild.commands.set(commands);
  console.log(`registered /ping in ${guild.id}`);
}

client.once(Events.ClientReady, async (ready) => {
  console.log(`ready as ${ready.user.tag}, ${VERSION}, in ${ready.guilds.cache.size} servers`);
  for (const guild of ready.guilds.cache.values()) await register(guild).catch((e) => console.error(e.message));
});
client.on(Events.GuildCreate, (guild) => register(guild).catch((e) => console.error(e.message)));

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== "ping") return;
  await interaction.reply(`pong from ${VERSION}`);
  console.log(`answered ${interaction.id} on ${os.hostname()} with ${VERSION}`);
});

client.login(process.env.DISCORD_TOKEN);
