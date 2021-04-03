import { Client, Message, MessageEmbed } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';

import Utils from '../../Utils/Utils';
const utils: Utils = new Utils();

const KissUrls = [
	'https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif',
	'https://media.giphy.com/media/vUrwEOLtBUnJe/giphy.gif',
	'https://media.giphy.com/media/zkppEMFvRX5FC/giphy.gif',
	'https://media.giphy.com/media/jR22gdcPiOLaE/giphy.gif',
	'https://media.giphy.com/media/iseq9MQgxo4aQ/giphy.gif',
	'https://media.giphy.com/media/QGc8RgRvMonFm/giphy.gif',
	'https://media.giphy.com/media/AZSjToDmW19WU/giphy.gif',
	'https://media.giphy.com/media/vUrwEOLtBUnJe/giphy.gif',
	'https://media.giphy.com/media/dj7V210SR2UBG/giphy.gif',
	'https://media.giphy.com/media/11rWoZNpAKw8w/giphy.gif'
]

module.exports = class KissCommand extends CommandBase {
	constructor() {
		super({
			name: 'kiss',
			description: 'Kiss another member.',
			category: "fun",
			usage: "<member>"
		});
	}

	async run(instance: BatClient, client: Client, message: Message, args: string[], guildData: Guild) {
		if (args.length < 1) {
			message.channel.send(`You need to provide a user to kiss.`);
			return;
		}
		const target = await utils.getTarget(message, args[0]);
		if (target == undefined) {
			message.channel.send(`You have given a unknown user, you can mention them or use their id.`);
			return;
		}
		if (target.id == message.author.id) {
			message.channel.send(`How do you plan to kiss yourself?`);
			return;
		}
		message.channel.send(new MessageEmbed()
			.setColor("GREEN")
			.setAuthor(`${message.author.username}#${message.author.discriminator} has kissed ${target.user.username}#${target.user.discriminator}`)
			.setImage(KissUrls[Math.floor(Math.random() * KissUrls.length)])
			.setFooter(`Command executed by ${message.author.username}#${message.author.discriminator}`)
			.setTimestamp()
		)
	}
}