import { Client, Message } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';

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