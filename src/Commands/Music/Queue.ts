import { Player } from 'erela.js';
import { Message, MessageEmbed } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';
import Utils from '../../Utils/Utils';

const utils: Utils = new Utils();

module.exports = class QueueCommand extends CommandBase {
	constructor() {
		super({
			name: 'queue',
			description: 'Shows the next 10 songs.',
			category: "music"
		});
	}

	async run(instance: BatClient, client: any, message: Message, args: string[], guildData: Guild) {
		if (message.guild == null) return;
		if (message.member == null) return;

		const player: Player = client.manager.players.get(message.guild.id);

		if (message.member.voice.channel == null) {
			await message.channel.send("You need to be in a voice channel to use the queue command.");
			return;
		}
		if (!player) {
			await message.channel.send("No songs currently playing in this guild.");
			return;
		}
		const songs = player.queue;
		let description = `**Current Song**:\n${player.queue.current?.title}\n\n**Queue**:\n`;

		if (songs.length >= 1) {
			let index = 1;
			songs.forEach(song => {
				if (index - 1 <= 10) {
					if (song.duration !== undefined) {
						description += `**${index}** - ${song.title}\n`;
						index++;
					}
				}
			});
		} else {
			description += `Empty`;
		}
		message.channel.send(new MessageEmbed()
			.setColor("GREEN")
			.setAuthor("Queue ♪", client.user?.displayAvatarURL({ size: 2048 }))
			.setDescription(description)
		)
	}
}