import BatClient from '@imfascinated/bat-framework/dist/Client/BatClient';
import FeatureBase from '@imfascinated/bat-framework/dist/Feature/FeatureBase';
import { Manager, Player, Track, Node, Payload } from "erela.js";
import Spotify from 'erela.js-spotify';
import { Guild, GuildMember, VoiceState } from 'discord.js';

const Config = require('../../config.json');

module.exports = class MusicFeature extends FeatureBase {
	constructor() {
		super();
	}

	async init(instance: BatClient, client: any) {
		client.manager = new Manager({
			nodes: Config.music.nodes,
			plugins: [
				// Initiate the plugin and pass the two required options.
				new Spotify({
					clientID: Config.music.spotify.clientID,
					clientSecret: Config.music.spotify.clientSecret
				})
			],
			send(id: string, payload: Payload) {
				const guild = client.guilds.cache.get(id);
				if (guild) guild.shard.send(payload);
			},
		});

		client.manager.on("nodeConnect", (node: Node) => {
			console.log(`Shiroko > Music node ${node.options.identifier} connected`)
		});

		client.manager.on("nodeError", (node: Node, error: Error) => {
			console.log(`Shiroko > Music node ${node.options.identifier} had an error: ${error.message}`)
		});

		client.manager.on("trackStart", (player: Player, track: Track) => {
			const requester: any = track.requester;
			client.channels.cache
				.get(player.textChannel)
				.send(`**Playing** :notes: \`${track.title}\` - Now!\nRequested by \`${requester.username}#${requester.discriminator}\``);
		});

		client.manager.on("queueEnd", (player: Player) => {
			setTimeout(() => {
				if (player.playing == false) {
					client.channels.cache
						.get(player.textChannel)
						.send("Queue has ended.");
					player.destroy();
				}
			}, 30000)
		});

		client.on("raw", (d: any) => client.manager.updateVoiceState(d));

		client.once("ready", () => {
			client.manager.init(client.user.id);
		});

		client.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
			if (oldState == null) return;
			if (oldState.channel == null) return;
			const manager: Manager = await client.manager;

			// Honestly.. find a better way to do this
			const player = manager.players.get(newState.guild.id);
			if (player == undefined) return;
			if (player.voiceChannel == oldState.channelID) {
				if (oldState.channel.members.size == 1) {
					setTimeout(() => {
						if (oldState.channel == null) return;
						if (oldState.channel.members.size == 1) {
							console.log(5)
							const channel = client.channels.cache.get(player.textChannel);
							channel.send(`Leaving due to inactivity`);
							player.destroy();
						}
					}, 30000); // 30 Seconds
				}
			}
		});
	}
}
