import { Client, Message } from 'discord.js'
import BatClient from '@imfascinated/bat-framework/dist/Client/BatClient';
import CommandBase from '@imfascinated/bat-framework/dist/Command/CommandBase';
import Guild from '@imfascinated/bat-framework/dist/Guild/Guild';

module.exports = class MemberCountCommand extends CommandBase {
	constructor() {
		super({
			name: 'membercount',
			description: 'Displays how many members are in this guild.',
			category: "info"
		});
	}

	async run(instance: BatClient, client: Client, message: Message, args: string[], guildData: Guild) {
		message.channel.send(`**Member Count**: ${message.guild?.memberCount}`);
	}
}
