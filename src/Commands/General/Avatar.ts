import { Client, DMChannel, GuildMember, Message, MessageEmbed } from 'discord.js'
import BatClient from '@imfascinated/bat-framework/dist/Client/BatClient';
import CommandBase from '@imfascinated/bat-framework/dist/Command/CommandBase';
import Guild from '@imfascinated/bat-framework/dist/Guild/Guild';

import Utils from '../../Utils/Utils';
const utils: Utils = new Utils();

module.exports = class AvatarCommand extends CommandBase {
	constructor() {
		super({
			name: 'avatar',
			description: 'Get your or another members avatar.',
			category: "general",
			usage: "[user]",
			aliases: [
				"av"
			],
		});
	}

	async run(instance: BatClient, client: Client, message: Message, args: string[], guildData: Guild) {
		const { channel } = message;
		if (args.length < 1) {
			this.buildAvatarMessage(client, message);
			return;
		}
		const target = await utils.getTarget(message, args[0]);
		if (target == undefined) {
			channel.send(`You have given a unknown user, you can mention them or use their id.`);
			return;
		}
		this.buildAvatarMessage(client, message, target);
	}

	buildAvatarMessage(client: Client, message: Message, target?: GuildMember): void {
		const { author, channel } = message;
		const embed = new MessageEmbed();

		embed.setColor(`GREEN`);

		if (target) {
			embed.setAuthor(`${target.user.username}'s Avatar`, client.user?.displayAvatarURL({ size: 2048 }));
			embed.setImage(target.user.displayAvatarURL({ size: 4096, dynamic: true }));
		} else {
			embed.setAuthor(`Your Avatar`, client.user?.displayAvatarURL({ size: 2048 }));
			embed.setImage(author.displayAvatarURL({ size: 4096, dynamic: true }));
			embed.setFooter(`Command executed by ${message.author.username}#${message.author.discriminator}`)
			embed.setTimestamp()
		}
		channel.send(embed);
	}
}
