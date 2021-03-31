import BatClient from '../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import FeatureBase from '../../../Bat Bot/Bat Framework/dist/Feature/FeatureBase';
import { Manager, Player, Track, Node, Payload } from "erela.js";
import Spotify from 'erela.js-spotify';

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
		})
		client.manager.on("nodeConnect", (node: Node) => {
			console.log(`Shiroko > Music node ${node.options.identifier} connected`)
		})
		client.manager.on("nodeError", (node: Node, error: Error) => {
			console.log(`Shiroko > Music node ${node.options.identifier} had an error: ${error.message}`)
		})
		client.manager.on("trackStart", (player: Player, track: Track) => {
			client.channels.cache
				.get(player.textChannel)
				.send(`**Playing** :notes: \`${track.title}\` - Now!`);
		})
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
	}
}