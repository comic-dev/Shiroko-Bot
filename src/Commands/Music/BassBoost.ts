import { Player } from 'erela.js';
import { Message } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';
import Utils from '../../Utils/Utils';

const utils: Utils = new Utils();
const EQEnabled = new Set<String>();

module.exports = class BassBoostCommand extends CommandBase {
	constructor() {
		super({
			name: 'bassboost',
			description: 'Enables/disables the bass boost effect.',
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
			message.channel.send("You need to be in a voice channel to use the stop command.");
			return;
		}
		if (!player) {
			message.channel.send("No songs currently playing in this guild.");
			return;
		}

		if (!EQEnabled.has(message.guild.id)) {
			player.setEQ({ band: 0, gain: 0.10 }, { band: 1, gain: 0.15 }, { band: 2, gain: 0.75 });
			message.channel.send(`**Enabled** bass boost.\n*Please note: this command is currently experimental.*`);
			EQEnabled.add(message.guild.id);
			return;
		}
		EQEnabled.delete(message.guild.id);
		player.clearEQ();
		message.channel.send(`**Disabled** bass boost.\n*Please note: this command is currently experimental.*`);
	}
}