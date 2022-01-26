import { Client, Message } from 'discord.js'
import BatClient from '@imfascinated/bat-framework/dist/Client/BatClient';
import CommandBase from '@imfascinated/bat-framework/dist/Command/CommandBase';
import Guild from '@imfascinated/bat-framework/dist/Guild/Guild';
import ms from 'ms';

module.exports = class UptimeCommand extends CommandBase {
	constructor() {
		super({
			name: 'uptime',
			description: 'Shows my current uptime.',
			category: "info"
		});
	}

	async run(instance: BatClient, client: Client, message: Message, args: string[], guildData: Guild) {
		message.channel.send(`Uptime: \`${ms(process.uptime() * 1000, { long: true })}\``);
	}
}
