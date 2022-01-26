import { Message } from 'discord.js'
import BatClient from '@imfascinated/bat-framework/dist/Client/BatClient';
import CommandBase from '@imfascinated/bat-framework/dist/Command/CommandBase';
import Guild from '@imfascinated/bat-framework/dist/Guild/Guild';
import Utils from '../../Utils/Utils';

const utils: Utils = new Utils();

module.exports = class PauseResumeCommand extends CommandBase {
	constructor() {
		super({
			name: 'pause',
			description: 'Pauses/Resumes the currently playing song.',
			category: "music",
			aliases: [
				'resume'
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

		const player = client.manager.players.get(message.guild.id);

		if (message.member.voice.channel == null) {
			await message.channel.send("You need to be in a voice channel to use the stop command.");
			return;
		}
		if (!player) {
			await message.channel.send("No songs currently playing in this guild.");
			return;
		}
		player.pause(player.playing);
		await message.channel.send(`The player ${player.playing ? "resumed" : "paused"} has the song.`)
	}
}
