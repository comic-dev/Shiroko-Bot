import { Message } from 'discord.js'
import BatClient from '@imfascinated/bat-framework/dist/Client/BatClient';
import CommandBase from '@imfascinated/bat-framework/dist/Command/CommandBase';
import Guild from '@imfascinated/bat-framework/dist/Guild/Guild';

module.exports = class SayCommand extends CommandBase {
	constructor() {
		super({
			name: 'say',
			description: 'Make me say something.',
			category: "general",
			usage: "<message>"
		});
	}

	async run(instance: BatClient, client: any, message: Message, args: string[], guildData: Guild) {
		if (args.length < 1) {
			message.channel.send(`You need to provide something for me to say.`);
			return;
		}
		message.channel.send(args.join(" "));
	}
}
