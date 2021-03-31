import { Client, Message } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';

import Utils from '../../Utils/Utils';
const utils: Utils = new Utils();

import ms from 'ms';

module.exports = class RemindCommand extends CommandBase {
	constructor() {
		super({
			name: 'remind',
			description: 'Reminds you in a specified time, optinally with a message.',
			category: "reminders"
		});
	}

	async run(instance: BatClient, client: Client, message: Message, args: string[], guildData: Guild) {
		const { channel, author } = message;
		if (args.length < 1) {
			channel.send(`You must provide a time.`)
			return;
		}

		const time = ms(args[0]);
		const reason = args.slice(1).join(" ") || '';
		if (time > 604800000) { // 7 Days
			channel.send(`You cannot set reminders that are longer than 7 days.`);
			return;
		}
		channel.send(`I will remind you in **${ms(time)}**${reason !== '' ? ` about **${reason}**` : ""}.`);
		setTimeout(() => {
			channel.send(`<@${author.id}>, you asked me to remind you${reason !== '' ? ` about **${reason}**` : ""}.`)
		}, time);

		let reminders = utils.objectToMap(guildData.getData(`reminders`));
	}
}