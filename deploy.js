const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const deploy = async () => {
	const commands = [
		new SlashCommandBuilder()
			.setName('ping')
			.setDescription('Returns the ping.'),
		new SlashCommandBuilder()
			.setName('prefix')
			.setDescription('Manages the bot prefix.')
			.addSubcommand((sc) =>
				sc
					.setName('view')
					.setDescription('Views the current prefix.'),
			)
			.addSubcommand((sc) =>
				sc
					.setName('set')
					.setDescription('Sets the prefix to a new one.')
					.addStringOption((string) =>
						string
							.setName('value')
							.setDescription('The new prefix.')
							.setRequired(true),
					),
			),
		new ContextMenuCommandBuilder()
			.setName('User Info')
			.setType(2),
	].map(cmd => cmd.toJSON());

	const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

	try {
		const clientId = process.env.CLIENT_ID;

		console.log('Started refreshing Slash Commands and Context Menus...');

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		).then(() => {
			console.log('Slash Commands and Context Menus have now been deployed.');
		});
	}
	catch (e) {
		console.error(e);
	}
};

deploy();