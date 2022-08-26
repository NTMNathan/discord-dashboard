const { Client, EmbedBuilder, time, Partials, GatewayIntentBits, InteractionType } = require('discord.js');
const { stripIndents } = require('common-tags');
const mongoose = require('mongoose');

const db = require('./db/manager');

require('dotenv').config();

const client = new Client({
	allowedMentions: {
		parse: [
			'users',
			'roles',
		],
		repliedUser: true,
	},
	partials: [
		Partials.GuildMember,
		Partials.Channel,
		Partials.Message,
		Partials.User,
		Partials.Reaction,
	],
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
	],
});

client.on('ready', async () => {
	console.log('Bot is now online!');

	mongoose.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}).then(() => console.log('MongoDB Client has been successfully connected.'));

	const webPortal = require('./server');
	webPortal.load(client);
});

client.on('guildCreate', async guild => {
	if (!guild.available) return;

	await db.createServer(guild.id);

	console.log(`Joined server: ${guild.name}`);
});

client.on('interactionCreate', async interaction => {
	if (interaction.user.bot) return;

	if (interaction.type === InteractionType.ApplicationCommand) {
		if (interaction.commandName === 'ping') {
			const now = Date.now();
			await interaction.deferReply();

			await interaction.editReply({ content: `🏓 Pong!\n\nRoundtrip: **${Math.round(Date.now() - now)}ms**\nAPI Latency: **${Math.round(client.ws.ping)}ms**` });
		}
		else if (interaction.commandName === 'prefix') {
			await interaction.deferReply();

			const subCommand = interaction.options.getSubcommand();

			if (subCommand === 'view') {
				const server = await db.findServer(interaction.guild.id);

				await interaction.editReply({ content: `The prefix for this server ${server.prefix ? `is **\`${server.prefix}\`**` : 'has not been set.' }` });
			}
			else if (subCommand === 'set') {
				const prefix = interaction.options.getString('value');
				if (prefix.length > 3) return interaction.editReply({ content: 'The prefix cannot be more than **3** characters long!' });

				await db.updateServerPrefix(interaction.guild.id, prefix);

				return await interaction.editReply({ content: `Successfully set **${interaction.guild.name}**'s prefix to **\`${prefix}\`**` });
			}
		}
		if (interaction.commandName === 'User Info') {
			const member = interaction.guild.members.cache.get(interaction.targetId) || interaction.member;

			const embed = new EmbedBuilder()
				.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048 }) })
				.setColor('#5865F2')
				.setDescription(stripIndents`
                **ID:** ${member.id}
                **Bot:** ${member.bot ? 'Yes' : 'No'}
                **Created:** ${time(Math.trunc(member.user.createdTimestamp / 1000), 'd')}
                **Joined:** ${time(Math.trunc(member.joinedAt / 1000), 'd')}
                **Nickname:** ${member.nickname || 'None'}
                **Hoist Role:** ${member.roles.hoist ? member.roles.hoist : 'None'}
                `);

			await interaction.reply({ embeds: [embed] });
		}
	}
});

client.login(process.env.TOKEN);