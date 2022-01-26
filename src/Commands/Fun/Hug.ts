import { Client, Message, MessageEmbed } from 'discord.js'
import BatClient from '@imfascinated/bat-framework/dist/Client/BatClient';
import CommandBase from '@imfascinated/bat-framework/dist/Command/CommandBase';
import Guild from '@imfascinated/bat-framework/dist/Guild/Guild';

import giphy from 'giphy-api';
const giphs = giphy();

import Utils from '../../Utils/Utils';
const utils: Utils = new Utils();

module.exports = class HugCommand extends CommandBase {
	constructor() {
		super({
			name: 'slap',
			description: 'Slap another member.',
			category: "fun",
			usage: "<member>"
		});
	}

	async run(instance: BatClient, client: Client, message: Message, args: string[], guildData: Guild) {
		if (args.length < 1) {
			message.channel.send(`You need to provide a user to slap.`);
			return;
		}
		const target = await utils.getTarget(message, args[0]);
		if (target == undefined) {
			message.channel.send(`You have given a unknown user, you can mention them or use their id.`);
			return;
		}
		if (target.id == message.author.id) {
			message.channel.send(`How do you plan to slap yourself?`);
			return;
		}
		giphs.search({
			q: 'anime slap',
			rating: 'pg-13'
		}, (error, res) => {
			if (error) {
				message.channel.send('There was an error whilst fetching the gif, sorry!');
			} else {
				message.channel.send(new MessageEmbed()
					.setColor("GREEN")
					.setAuthor(`${message.author.username}#${message.author.discriminator} has slapped ${target.user.username}#${target.user.discriminator}`)
					.setImage(res.data[Math.floor(Math.random() * res.data.length)].images.original.url)
					.setFooter(`Command executed by ${message.author.username}#${message.author.discriminator}`)
					.setTimestamp()
				)
			}
		})
	}
}
