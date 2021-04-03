import { Client, Message, MessageEmbed } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';
import ms from 'ms';
import os from 'os';
import osu from 'node-os-utils';

const { version } = require('../../../package.json');
import Utils from '../../Utils/Utils';
const utils: Utils = new Utils()

module.exports = class BotInfoCommand extends CommandBase {
	constructor() {
		super({
			name: 'botinfo',
			description: 'Information about me.',
			category: "info"
		});
	}

	async run(instance: BatClient, client: Client, message: Message, args: string[], guildData: Guild) {
		let description = ``;
		description += `**__General__**\n`;
		description += `**>** Username: **Shiroko#5624**\n`;
		description += `**>** Owner: **Fascinated#4735**\n`;
		description += `**>** Creation Date: ** March 30th, 2021 **\n`;
		description += `**>** Total Guilds: **${client.guilds.cache.size}**\n`;
		description += `**>** Total Users: **${client.users.cache.size}**\n`;
		description += `**>** Total Commands: **${instance.commandHandler.commands.size}**\n`;
		description += `**>** Uptime: **${ms(process.uptime() * 1000, { long: true })}**\n`;
		description += `**>** Latency: **${client.ws.ping}ms**\n`;
		description += `**>** Bot Version: **${version}**\n`;

		if (message.author.id === '510639833811517460') {
			description += `**>** Memory Usage: **${utils.formatBytes(process.memoryUsage().heapUsed)}/${utils.formatBytes(process.memoryUsage().heapTotal)}**\n`;
			description += `\n**__System__**\n`;
			description += `**>** Uptime: **${ms(os.uptime() * 1000, { long: true })}**\n`;
			
			osu.proc.totalProcesses().then(info => console.info(info))
			await osu.cpu.usage().then(info => description += `**>** CPU Load: **${info}%**\n`);
			description += `**>** Memory Usage: **${utils.formatBytes(os.freemem())}/${utils.formatBytes(os.totalmem())} (${Math.round(os.freemem() * 100 / os.totalmem())}% used)**\n`;
		}

		const embed = new MessageEmbed();
		embed.setColor(`GREEN`);
		embed.setDescription(description);
		embed.setFooter(`Command executed by ${message.author.username}#${message.author.discriminator}`);
		embed.setTimestamp();
		message.channel.send(embed);
	}
}