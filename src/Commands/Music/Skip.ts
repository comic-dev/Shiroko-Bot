import { Player } from 'erela.js';
import { Message } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';
import Utils from '../../Utils/Utils';

const utils: Utils = new Utils();

module.exports = class StopCommand extends CommandBase {
	constructor() {
		super({
			name: 'skip',
			description: 'Skips the current song.',
			category: "music"
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
		// Yes, this actually skips it. Don't ask /shrug
		player.stop();
		await message.channel.send(`Skipped the current song.`)
	}
}