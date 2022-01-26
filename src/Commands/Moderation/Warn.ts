import { Client, DMChannel, Message } from 'discord.js'
import BatClient from '@imfascinated/bat-framework/dist/Client/BatClient';
import CommandBase from '@imfascinated/bat-framework/dist/Command/CommandBase';
import Guild from '@imfascinated/bat-framework/dist/Guild/Guild';

import Utils from '../../Utils/Utils';
const utils: Utils = new Utils();

module.exports = class WarnCommand extends CommandBase {
	constructor() {
		super({
			name: 'warn',
			description: 'Warn a member, optionally with a reason.',
			category: "moderation",
			usage: "<@user> [reason]",
			// Change to something more fitting?
			userPermissions: [
				'MANAGE_MESSAGES'
			]
		});
	}

	async run(instance: BatClient, client: Client, message: Message, args: string[], guildData: Guild) {
		const { author, channel } = message;
		if (args.length < 1) {
			channel.send(`You must provide a user to warn.\n*Example: ${guildData.prefix}warn @Fascinated This is a test warn*`);
			return;
		}
		const target = await utils.getTarget(message, args[0]);
		if (target == undefined) {
			channel.send(`You have given a unknown user, you can mention them or use their id.`);
			return;
		}
		const reason = args.slice(1).join(" ");
		channel.send(`You have **warned** ${target.user.username}#${target.user.discriminator} ${args.length > 1 ? `for **${reason}**` : ""}`)
		target.createDM().then((dmChannel: DMChannel) => {
			dmChannel.send(`You have been warned by **${author.username}#${author.discriminator}** ${args.length > 1 ? `for **${reason}**` : ""}`);
		});
		if (guildData.getData(`warnings`) == null) {
			await guildData.setData(`warnings`, new Map<String, []>(), true);
		}
		let warnings = utils.objectToMap(guildData.getData(`warnings`));
		if (warnings == undefined) {
			channel.send(`There was an error whilst accessing the database.`);
			return;
		}
		let targetWarnings = warnings.get(target.id);
		if (targetWarnings == undefined) {
			targetWarnings = [];
			console.log(`target warnings was undefined`)
		}
		targetWarnings.push({
			id: `1`,
			punisher: `${author.username}#${author.discriminator}`,
			reason: reason || "No reason provided."
		});
		warnings.set(target.id, targetWarnings);
		await guildData.setData(`warnings`, warnings, true);
	}
}
