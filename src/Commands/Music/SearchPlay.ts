import { Manager, Node, Player, Track } from 'erela.js';
import { Message, TextChannel, DMChannel, NewsChannel, MessageEmbed, GuildMember } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';

module.exports = class SearchPlayCommand extends CommandBase {
	constructor() {
		super({
			name: 'searchplay',
			description: 'Play a song using a **1-5** selection.',
			category: "music",
			usage: "<query>",
			aliases: ['sp'],

		});
	}

	async run(instance: BatClient, client: any, message: Message, args: string[], guildData: Guild) {
		if (args.length < 1) {
			message.channel.send("You need to put a search query!");
			return;
		}

		if (args[0].includes("https://")) {
			message.channel.send("You cant use links with search play!");
			return;
		}

		const query = args.join(" ");
		const manager: Manager = await client.manager;
		const results = await manager.search(
			query,
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
			djChannel.send(`You cannot use music commands in this channel, I have been bound to <#${player.textChannel}>\n*You are using music node ${this.getNodeId(manager, player.node)}*`)
			return;
		}

		if (!voiceChannel.members.has(client.user.id)) {
			djChannel.send(`Joined **${voiceChannel.name}** and bound to <#${djChannel.id}>`);
			player.connect();
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
				
			case "SEARCH_RESULT": {
				const embed = new MessageEmbed();
				embed.setColor("YELLOW");
				embed.setAuthor(`Search Play - ${query}`, client.user?.displayAvatarURL({ size: 2048 }));

				let description = '';
				let index = 1;
				results.tracks.forEach(track => {
					if (index <= 5) {
						description += `**${index}** - \`${track.title}\`\n`
					}
					index++;
				})
				embed.setDescription(description);
				message.channel.send(embed);

				const filter = (m: Message) => m.author.id == message.author.id;
				const collector = message.channel.createMessageCollector(filter, { max: 1, time: 15000 });

				collector.on('end', collected => {
					const msg = collected.first();
					if (msg == undefined) {
						message.channel.send("Search play request timed out after 15 seconds.")
						return;
					}
					const number = Number.parseInt(msg.content);
					if (isNaN(number)) {
						message.channel.send("You have not provided a valid number.")
						return;
					}
					if (number < 1) {
						message.channel.send("You cant play results lower than 1.")
						return;
					}
					if (number > 5) {
						message.channel.send("You cant play results higher than 5.")
						return;
					}
					const song = results.tracks[number - 1]
					this.loadSong(song, djChannel, player);
				});
				break;
			}
		}
	}

	loadSong(song: Track, djChannel: TextChannel | DMChannel | NewsChannel, player: Player) {
		player.queue.add(song);
		djChannel.send(`Queuing song \`${song.title}\``);
		if (!player.playing && !player.paused && !player.queue.size)
			player.play();
	}

	getNodeId(manager: Manager, node: Node): string {
		let index = 1;
		manager.nodes.forEach(nodee => {
			if (nodee.options.host !== node.options.host) {
				index++;
			}
		})
		return `${index}/${manager.nodes.size}`;
	}
}