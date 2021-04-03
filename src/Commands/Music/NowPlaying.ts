import { Player } from 'erela.js';
import { Message, MessageEmbed } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';
import Utils from '../../Utils/Utils';

const utils: Utils = new Utils();

module.exports = class NowPlayingCommand extends CommandBase {
	constructor() {
		super({
			name: 'nowplaying',
			description: 'Information about the currently playing song.',
			category: "music",
			aliases: [
				'np'
			]
		});
	}

	async run(instance: BatClient, client: any, message: Message, args: string[], guildData: Guild) {
		if (message.guild == null) return;
		if (message.member == null) return;

		if (utils.hasRole(message.member, "DJ") == false) {
			message.channel.send("You need the `DJ` role to use this command.")
			return;
		}

		const player: Player = client.manager.players.get(message.guild.id);

		if (message.member.voice.channel == null) {
			message.channel.send("You need to be in a voice channel to use the stop command.");
			return;
		}
		if (!player) {
			message.channel.send("No songs currently playing in this guild.");
			return;
		}
		const song = player.queue.current;
		if (!song) {
			message.channel.send("No songs currently playing in this guild.");
			return;
		}
		if (song.duration == undefined) {
			message.channel.send("An error has occured whilst getting the current song.");
			return;
		}
		const requester: any = song.requester;
		const embed = new MessageEmbed()
			.setColor(`GREEN`)
			.setAuthor("Now Playing ♪", client.user?.displayAvatarURL({ size: 2048 }))
			.setDescription(
				`
				[${song.title}](${song.uri})
				
				\`${this.formatBar(player.position, song.duration)}\`
				
				\`${utils.formatTime(player.position, true)} / ${utils.formatTime(song.duration, true)}\`

				Requested By: \`${requester.username}#${requester.discriminator}\`
				`
			)
			.setFooter(`Command executed by ${message.author.username}#${message.author.discriminator}`)
			.setTimestamp()
			.setThumbnail(song.thumbnail || "");
		await message.channel.send(embed);
	}


	formatBar(current: number, duration: number | undefined) {
		if (duration === undefined) return "🔘" + "▬".repeat(20);
		// How long the bar is
		const length = 20;
		// Progress in %
		let progress = (current / duration * 100);
		// Set progress to: progress / (length / 100)
		progress = (progress - (progress % 5)) / 5;
		// Repeat a char {progress} amount of times
		let formatted = "▬".repeat(progress);
		formatted = formatted.substring(0, formatted.length - 1) + "🔘";
		// Fill the leftover spaces in the bar to make it reach the desired length
		for (let i = 0; i < length - progress; i++) {
			formatted += "▬";
		}
		// Turn to string
		return formatted;
	}
}