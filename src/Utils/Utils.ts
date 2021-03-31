import { GuildMember, Message } from 'discord.js';

export default class Utils {
	constructor() {}

	hasRole(member: GuildMember, roleName: string): boolean {
		let hasRole = false;
		member.roles.cache.forEach(role => {
			if (role.name === roleName) {
				hasRole = true;
			}
		});
		return hasRole;
	}

	formatTime(seconds: number, long: boolean = true): string {
		function pad(s: number) {
			return (s < 10 ? "0" : "") + s;
		}
		var days = Math.floor(seconds / (60 * 60 * 24));
		var hours = Math.floor(seconds / (60 * 60));
		var minutes = Math.floor((seconds % (60 * 60)) / 60);
		var seconds = Math.floor(seconds % 60);

		return pad(days) + "d " + pad(hours) + "h " + pad(minutes) + "m " + pad(seconds) + "s";
	}

	formatSongTime(seconds: number, long: boolean = true): string {
		function pad(s: number) {
			return (s < 10 ? "0" : "") + s;
		}
		var days = Math.floor(seconds / (60 * 60 * 24));
		var hours = Math.floor(seconds / (60 * 60));
		var minutes = Math.floor((seconds % (60 * 60)) / 60);
		var seconds = Math.floor(seconds % 60);

		return pad(days) + ":" + pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
	}

	async getTarget(message: Message, arg: string): Promise<GuildMember | undefined> {
		const messageMentions = message.mentions.members;
		if (messageMentions) {
			return messageMentions.first();
		}
		const targetById = await message.guild?.members.fetch(arg);
		if (targetById) {
			return targetById;
		}
		return undefined;
	}

	objectToMap(obj: any) {
		const mp = new Map();
		Object.keys(obj).forEach((k) => {
			mp.set(k, obj[k]);
		});
		return mp;
	};
}
