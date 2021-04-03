import { Client, Message } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';
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