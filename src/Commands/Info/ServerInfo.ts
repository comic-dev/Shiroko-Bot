import { Client, Message, MessageEmbed } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';
import moment from 'moment';

module.exports = class ServerInfoCommand extends CommandBase {
	constructor() {
		super({
			name: 'serverinfo',
			description: 'Shows all of the server information.',
			category: "info"
		});
	}

	async run(instance: BatClient, client: Client, message: Message, args: string[], guildData: Guild) {
		if (message.guild == null) return;
		if (message.guild.owner == null) return;

		let description = ``;
		description += `Here's information on **${message.guild.name}**.`;
		description += `\n\n`;
		description += `**>** Owner: **${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}**\n`;
		description += `**>** Created On: **${moment(message.guild.createdTimestamp).format('MMM D, YYYY')}**\n`;
		description += `**>** Region: **${message.guild.region}**\n`;
		description += `**>** Verification Level: **${message.guild.verificationLevel.toLowerCase()}**\n`;
		description += `**>** Members: **${message.guild.memberCount}**\n`;
		description += `**>** Bots: **${this.getBotCount(message)}**\n`;
		description += `**>** Total Roles: **${message.guild.roles.cache.size}**\n`;
		description += `**>** Total Emojis: **${message.guild.emojis.cache.size}**\n`;
		description += `**>** Roles:\n`;
		description += `\n`;

		const rolesArray = message.guild.roles.cache.array();
		description += `**(${rolesArray.length}) Roles**\n`;
		for (let index = 0; index < rolesArray.length; index++) {
			const role = rolesArray[index];
			if (role.name === '@everyone') continue;
			description += `<@&${role.id}> • `;
		}
		description = description.substring(0, description.length - 3);

		const guildIcon = message.guild.iconURL({ dynamic: true, size: 4096 }) || 'https://i.guim.co.uk/img/media/b73cc57cb1d46ae742efd06b6c58805e8600d482/16_0_2443_1466/master/2443.jpg?width=700&quality=85&auto=format&fit=max&s=fb1dca6cdd4589cd9ef2fc941935de71'

		const embed = new MessageEmbed();
		embed.setColor(`GREEN`);
		embed.setDescription(description);
		embed.setThumbnail(guildIcon);
		embed.setFooter(`Command executed by ${message.author.username}#${message.author.discriminator}`);
		embed.setTimestamp();
		message.channel.send(embed);
	}

	getBotCount(message: Message): number {
		if (message.guild == null) return 0;
		const array = message.guild.members.cache.array();
		let botCount = 0;
		for (let index = 0; index < array.length; index++) {
			const member = array[index];
			if (member.user.bot) {
				botCount++;
			}
		}
		return botCount;
	}
}