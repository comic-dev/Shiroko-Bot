import { Client, Message } from 'discord.js'
import BatClient from '@imfascinated/bat-framework/dist/Client/BatClient';
import CommandBase from '@imfascinated/bat-framework/dist/Command/CommandBase';
import Guild from '@imfascinated/bat-framework/dist/Guild/Guild';

module.exports = class PurgeCommand extends CommandBase {
	constructor() {
		super({
			name: 'purge',
			description: 'Purge a specified amount of messages.',
			category: "moderation",
			userPermissions: [
				'MANAGE_MESSAGES'
			]
		});
	}

	async run(instance: BatClient, client: Client, message: Message, args: string[], guildData: Guild) {
		if (args.length < 1) {
			message.channel.send(`You must provide an amount of messages to purge.`)
			return;
		}

		const count = Number.parseInt(args[0]);
		if (isNaN(count)) {
			message.channel.send(`You need to provide a number.`)
			return;
		}
		if (count < 1) {
			message.channel.send(`You need to provide a number higher than 0.`)
			return;
		}
		if (count > 100) {
			message.channel.send(`You need to provide a number lower than 100.`)
			return;
		}
		let deletedCount = -1;
		message.channel.messages.fetch({ limit: Math.min(count + 1, 100) }).then(async messages => {
			const msg = await message.channel.send(`:arrows_counterclockwise: Purging messages, please wait...`)
			messages.forEach(message => {
				message.delete();
				deletedCount++;
			});
			msg.edit(`:white_check_mark: Purged \`${deletedCount}\` messages.`);
		}).catch(() => {
			message.channel.send(`There was an error whilst purging the messages`);
		});
	}
}
