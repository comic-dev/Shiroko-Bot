import { Message } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';

module.exports = class BotInviteCommand extends CommandBase {
	constructor() {
		super({
			name: 'botinvite',
			description: 'Gives you the invite link to the bot.',
			category: "general"
		});
	}

	async run(instance: BatClient, client: any, message: Message, args: string[], guildData: Guild) {
		message.channel.send(`Invite Link: https://discord.com/api/oauth2/authorize?client_id=824316247846944789&permissions=8&scope=bot`);
	}
}