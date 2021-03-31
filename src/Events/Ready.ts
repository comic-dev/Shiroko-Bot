import { Client } from 'discord.js';
import BatClient from '../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import EventBase from '../../../Bat Bot/Bat Framework/dist/Event/EventBase';

module.exports = class ReadyEvent extends EventBase {
	constructor() {
		super({
			event: 'ready'
		});
	}

	run(instance: BatClient, client: Client) {
		console.log(
			`Shiroko > Successfully loaded and now online! Connected to ${client.guilds.cache.size} guilds and ${client.users.cache.size} members.`
		);
	}
}