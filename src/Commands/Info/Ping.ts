import { Client, Message } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';

module.exports = class PingCommand extends CommandBase {
	constructor() {
		super({
			name: 'ping',
			description: 'Shows my current response time to discord.',
			category: "info"
		});
	}

	async run(instance: BatClient, client: Client, message: Message, args: string[], guildData: Guild) {
		const before = Date.now();
		const msg = await message.channel.send(`Pinging...`);
		msg.edit(`Pong! \`${Date.now() - before}ms\``)
	}
}