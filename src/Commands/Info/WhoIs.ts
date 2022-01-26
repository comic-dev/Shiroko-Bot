import { Client, GuildMember, Message, MessageEmbed } from 'discord.js'
import BatClient from '@imfascinated/bat-framework/dist/Client/BatClient';
import CommandBase from '@imfascinated/bat-framework/dist/Command/CommandBase';
import Guild from '@imfascinated/bat-framework/dist/Guild/Guild';
import moment from 'moment';

import Utils from '../../Utils/Utils';
const utils: Utils = new Utils();

module.exports = class UptimeCommand extends CommandBase {
	constructor() {
		super({
			name: 'whois',
			description: 'Who is someone?',
			category: "info",
			usage: "<member>",
			aliases: [
				"memberinfo",
				"userinfo",
				"meminfo"
			]
		});
	}

	async run(instance: BatClient, client: Client, message: Message, args: string[], guildData: Guild) {
		if (message.member == null) return;

		if (args.length < 1) {
			this.buildWhoIsMessage(message);
			return;
		}
		const target = await utils.getTarget(message, args[0]);
		if (target == undefined) {
			message.channel.send(`You have given a unknown user, you can mention them or use their id.`);
			return;
		}
		this.buildWhoIsMessage(message, target);
	}

	buildWhoIsMessage(message: Message, target?: GuildMember) {
		if (target) {
			let description = ``;
			description += `Here's the latest information that I could manage to find on **${target.displayName}**.\n\n`;
			description += `**>** Display Name: **${target.displayName}**\n`;
			description += `**>** Username: **${target.user.username}#${target.user.discriminator}**\n`;
			description += `**>** Joined On: **${moment(target.joinedTimestamp).format('MMM D, YYYY')}**\n`;
			description += `**>** Account Created On: **${moment(target.user.createdTimestamp).format('MMM D, YYYY')}**\n`;
			description += `**>** Roles:\n\n`;

			const rolesArray = target.roles.cache.array();
			description += `**(${rolesArray.length}) Roles**\n`;
			for (let index = 0; index < rolesArray.length; index++) {
				const role = rolesArray[index];
				if (role.name === '@everyone') continue;
				description += `<@&${role.id}> • `;
			}
			description = description.substring(0, description.length - 3);

			const embed = new MessageEmbed();
			embed.setColor(`GREEN`);
			embed.setTitle(`Who is ${target.displayName}?`);
			embed.setDescription(description);
			embed.setThumbnail(target.user.displayAvatarURL({ dynamic: true, size: 4096 }));
			embed.setFooter(`Command executed by ${message.author.username}#${message.author.discriminator}`);
			embed.setTimestamp();
			message.channel.send(embed);
		} else {
			if (message.member == null) return;

			let description = ``;
			description += `Here's the latest information that I could manage to find on **${message.member.displayName}**.\n\n`;
			description += `**>** Display Name: **${message.member.displayName}**\n`;
			description += `**>** Username: **${message.author.username}#${message.author.discriminator}**\n`;
			description += `**>** Joined On: **${moment(message.member.joinedTimestamp).format('MMM D, YYYY')}**\n`;
			description += `**>** Account Created On: **${moment(message.author.createdTimestamp).format('MMM D, YYYY')}**\n`;
			description += `**>** Roles:\n\n`;

			const rolesArray = message.member.roles.cache.array();
			description += `**(${rolesArray.length}) Roles**\n`;
			for (let index = 0; index < rolesArray.length; index++) {
				const role = rolesArray[index];
				if (role.name === '@everyone') continue;
				description += `<@&${role.id}> • `;
			}
			description = description.substring(0, description.length - 3);

			const embed = new MessageEmbed();
			embed.setColor(`GREEN`);
			embed.setTitle(`Who is ${message.member.displayName}?`);
			embed.setDescription(description);
			embed.setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 4096 }));
			embed.setFooter(`Command executed by ${message.author.username}#${message.author.discriminator}`);
			embed.setTimestamp();
			message.channel.send(embed);
		}
	}
}
