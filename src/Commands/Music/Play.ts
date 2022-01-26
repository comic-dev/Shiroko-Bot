import { Manager, Node, Player, SearchResult, Track } from 'erela.js';
import { Message, TextChannel, DMChannel, NewsChannel } from 'discord.js'
import BatClient from '@imfascinated/bat-framework/dist/Client/BatClient';
import CommandBase from '@imfascinated/bat-framework/dist/Command/CommandBase';
import Guild from '@imfascinated/bat-framework/dist/Guild/Guild';

module.exports = class PlayCommand extends CommandBase {
	constructor() {
		super({
			name: 'play',
			description: 'Plays a song or playlist that is provided.',
			category: "music",
			usage: "<query>",
			aliases: [
				'p'
			]
		});
	}

	async run(instance: BatClient, client: any, message: Message, args: string[], guildData: Guild) {
		if (args.length < 1) {
			message.channel.send("You need to put a search or playlist query!");
			return;
		}

		const manager: Manager = await client.manager;
		const results = await manager.search(
			args.join(" "),
			message.author
		);

		if (message.guild == null) return;
		if (message.member == null) return;
		if (message.member.voice.channel == null) return;

		const voiceChannel = message.member.voice.channel;
		const djChannel = message.channel;

		const player = manager.create({
			guild: message.guild.id,
			voiceChannel: voiceChannel.id,
			textChannel: djChannel.id,
			selfDeafen: true,
			volume: 75
		});

		if (player.textChannel !== djChannel.id) {
			djChannel.send(`You cannot use music commands in this channel, I have been bound to <#${player.textChannel}>`)
			return;
		}

		if (!voiceChannel.members.has(client.user.id)) {
			djChannel.send(`Joined **${voiceChannel.name}** and bound to <#${djChannel.id}>\n*You are using music node ${this.getNodeId(manager, player.node)}*`);
			player.connect();

			setTimeout(() => {
				if (!voiceChannel.members.has(client.user.id)) {
					djChannel.send(`Failed to connect to **${voiceChannel.name}**. Do I have permission to connect?`);
					player.destroy();
				}
			}, 400);
		}
			
		switch (results.loadType) {
			case "NO_MATCHES": {
				djChannel.send(`There was no search results found for \`${args.join(" ")}\``)
				return;
			}
				
			case "LOAD_FAILED": {
				djChannel.send(`There was an error whilst searching for \`${args.join(" ")}\``)
				return;
			}
				
			case "PLAYLIST_LOADED": {
				if (results.playlist == undefined) {
					djChannel.send(`There was an error whilst loading playlist \`${args.join(" ")}\``)
					return;
				}
				results.tracks.forEach((track: Track) => {
					player.queue.add(track);
				})
				djChannel.send(`Queueing playlist: \`${results.playlist.name}\` with \`${results.tracks.length}\` songs`);
				if (!player.playing && !player.paused && player.queue.totalSize === results.tracks.length)
					player.play();
				break;
			}
				
			case "TRACK_LOADED": {
				this.loadSong(results, djChannel, player);
				break;
			}
				
			case "SEARCH_RESULT": {
				this.loadSong(results, djChannel, player);
				break;
			}
		}
	}

	loadSong(results: SearchResult, djChannel: TextChannel | DMChannel | NewsChannel, player: Player) {
		const song = results.tracks[0];

		player.queue.add(song);
		djChannel.send(`Queuing song \`${song.title}\``);
		if (!player.playing && !player.paused && !player.queue.size)
			player.play();
	}

	getNodeId(manager: Manager, node: Node): string {
		let index = 0;
		manager.nodes.forEach(nodee => {
			if (nodee.options.host !== node.options.host) {
				index++;
			}
		})
		return `${index}/${manager.nodes.size}`;
	}
}
