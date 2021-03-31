import { Manager } from 'erela.js';
import { Message, MessageEmbed } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';

module.exports = class MusicStatsCommand extends CommandBase {
	constructor() {
		super({
			name: 'musicstats',
			description: 'Stats about the music nodes.',
			category: "botowner",
			botOwnerOnly: true
		});
	}

	async run(instance: BatClient, client: any, message: Message, args: string[], guildData: Guild) {
		const manager: Manager = await client.manager;

		let description = '';

		let averageCpu = 0;
		let totalPlayers = 0;
		let totalPlayingPlayers = 0;

		let index = 0;
		manager.nodes.forEach(node => {
			description += `**__Node ${index+1}__**\n**CPU Usage**: ${node.stats.cpu.lavalinkLoad.toPrecision(2)}%\n**Players**: ${node.stats.players}/${node.stats.playingPlayers}\n`
			averageCpu += node.stats.cpu.lavalinkLoad
			totalPlayers += node.stats.players
			totalPlayingPlayers += node.stats.playingPlayers
			index++;
		});
		averageCpu = averageCpu / index;
		description += `\n\n**__Music Nodes Overall__**\n**Average Cpu**: ${averageCpu.toPrecision(2)}%\n**Players**: ${totalPlayers}/${totalPlayingPlayers} *(playing / active)*`
		message.channel.send(new MessageEmbed()
			.setAuthor("Music Node Stats", client.user?.displayAvatarURL({ size: 2048 }))
			.setColor(`GREEN`)
			.setDescription(description)
		)
	}
}