import { Player } from 'erela.js';
import { Message } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';
import Utils from '../../Utils/Utils';

const utils: Utils = new Utils();

module.exports = class VolumeCommand extends CommandBase {
	constructor() {
		super({
			name: 'volume',
			description: 'Sets the volume from **0-100**.',
			category: "music",
			usage: "<volume>",
			aliases: [
				'vol'
			]
		});
	}

	async run(instance: BatClient, client: any, message: Message, args: string[], guildData: Guild) {
		if (message.guild == null) return;
		if (message.member == null) return;

		if (args.length < 1) {
			message.channel.send("You need to provide a volume for me to update it to.")
			return;
		}

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
		const volume = Number.parseInt(args[0]);
		if (isNaN(volume)) {
			message.channel.send(`You need to provide a volume for me to update it to.`);
			return;
		}
		if (volume < 0) {
			message.channel.send(`You cannot set the volume lower than **0**.`);
			return;
		}
		if (volume > 100) {
			message.channel.send(`You cannot set the volume higher than **100**.`);
			return;
		}
		player.setVolume(volume);
		await message.channel.send(`The volume has been set to **${volume}%**.`)
	}
}