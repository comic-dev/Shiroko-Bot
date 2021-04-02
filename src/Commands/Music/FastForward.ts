import { Player } from 'erela.js';
import { Message } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';
import Utils from '../../Utils/Utils';
import ms from 'ms';

const utils: Utils = new Utils();

module.exports = class FastForwardCommand extends CommandBase {
	constructor() {
		super({
			name: 'fastforward',
			description: 'Fast forwards the song a specified amount.',
			category: "music",
			usage: "<time>",
			aliases: [
				'ff'
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
			await message.channel.send("You need to be in a voice channel to use the stop command.");
			return;
		}
		if (!player) {
			await message.channel.send("No songs currently playing in this guild.");
			return;
		}
		const time = ms(args[0]);
		const song = player.queue.current;
		if (song == null) return;
		let duration = song.duration;
		if (duration == undefined) return;
		if (player.position + time > duration) {
			message.channel.send(`You can't fast forward that far.`);
			return;
		}
		player.seek(player.position + time);
		if (duration == undefined) return;
		message.channel.send(`You have fast forwarded the song to ${utils.formatTime(player.position + time, true)}.`);
	}
}