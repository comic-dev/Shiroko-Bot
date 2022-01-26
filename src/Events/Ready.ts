import { Client } from 'discord.js';
import BatClient from '.@imfascinated/bat-framework/dist/Client/BatClient';
import EventBase from '@imfascinated/bat-framework/dist/Event/EventBase';

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
