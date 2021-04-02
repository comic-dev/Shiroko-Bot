import { Client, Message, MessageEmbed } from 'discord.js'
import BatClient from '../../../../Bat Bot/Bat Framework/dist/Client/BatClient';
import CommandBase from '../../../../Bat Bot/Bat Framework/dist/Command/CommandBase';
import Guild from '../../../../Bat Bot/Bat Framework/dist/Guild/Guild';

module.exports = class HelpCommand extends CommandBase {
	constructor() {
		super({
			name: 'help',
			description: 'Shows all of my commands.',
			usage: "[command/category]",
			category: "general"
		});
	}

	async run(instance: BatClient, client: Client, message: Message, args: string[], guildData: Guild) {
		if (args.length < 1) {
			this.buildHelpMessage(instance, client, message, guildData);
			return;
		}

		const command = instance.commandHandler.getCommandByName(args[0]);
		if (command) {
			this.buildCommandMessage(instance, client, command, message, args, guildData);
		} else {
			this.buildCommandCategoryMessage(instance, client, args[0], message, args, guildData);
		}
	}

	buildHelpMessage(instance: BatClient, client: Client, message: Message, guildData: Guild) {
		const categories = this.getCategories(instance);
		const embed = new MessageEmbed();
		const prefix = guildData.prefix;

		const { member } = message;

		if (member == null) return;

		embed.setColor("GREEN");
		embed.setAuthor("General Help", client.user?.displayAvatarURL({ size: 2048 }));
		embed.setDescription("make a description kekw");

		categories.forEach(category => {
			if (category == "botowner") {
				if (instance.botOwners.includes(member.id)) {
					embed.addField(
						this.capitalize(category),
						`
						\`${prefix}help ${category.toLowerCase()}\`
						**(${this.getTotalCommandsByCategory(instance, category)}) Commands**
						`,
						true
					);
				}
			} else {
				embed.addField(
					this.capitalize(category),
					`
				\`${prefix}help ${category.toLowerCase()}\`
				**(${this.getTotalCommandsByCategory(instance, category)}) Commands**
				`,
					true
				);
			}
		});

		message.channel.send(embed);
	}

	buildCommandMessage(instance: BatClient, client: Client, command: CommandBase, message: Message, args: string[], guildData: Guild) {
		const embed = new MessageEmbed();
		const prefix = guildData.prefix;

		embed.setColor("GREEN");
		embed.setAuthor(`Help - ${this.capitalize(command.name)}`, client.user?.displayAvatarURL({ size: 2048 }));

		embed.setDescription(
			`
			**Name**: ${command.name}
			**Description**: ${command.description}
			**Aliases**: ${command.aliases.length > 0 ? command.aliases.join(", ") : "None."}

			**Usage**: ${command.usage !== "" ? `${prefix}${args[0].toLowerCase()} ${command.usage}` : "Usage not found."}
			`
		)

		message.channel.send(embed);
	}

	buildCommandCategoryMessage(instance: BatClient, client: Client, category: string, message: Message, args: string[], guildData: Guild) {
		const embed = new MessageEmbed();
		const prefix = guildData.prefix;

		embed.setColor("GREEN");
		embed.setAuthor(`Help - ${this.capitalize(category)}`, client.user?.displayAvatarURL({ size: 2048 }));

		let commands = this.getCommandsFromCategory(instance, category);
		if (commands.length < 1) {
			embed.setAuthor(`Help - Unknown`, client.user?.displayAvatarURL({ size: 2048 }));
			embed.setDescription("That category does not exist.");
			message.channel.send(embed);
			return;
		}

		let description = '';
		commands.forEach(command => {
			const perms = command.userPermissions;
			let permissions = '';
			if (perms) {
				perms.forEach(permission => {
					permissions += this.capitalize(permission.toLowerCase()) + ", ";
				})
				permissions = permissions.substring(0, permissions.length - 2);
			}
			description += `**${prefix}${command.name.toLowerCase()}** - ${command.description} ${permissions !== '' ? `[${permissions}]` : ""}\n`
		});
		embed.setDescription(description);
		message.channel.send(embed);
	}

	// Add a check to see if the command is disabled and if it is and the category has no avalible commands to not add it.
	getCategories(instance: BatClient): string[] {
		const categories: string[] = [];

		instance.commandHandler.commands.forEach(command => {
			if (!categories.includes(command.category)) {
				categories.push(command.category);
			}
		})
		return categories;
	}

	getCommandsFromCategory(instance: BatClient, category: string): CommandBase[] {
		const commands: CommandBase[] = [];

		instance.commandHandler.commands.forEach(command => {
			if (command.category == category) {
				commands.push(command);
			}
		})
		return commands;
	}

	getTotalCommandsByCategory(instance: BatClient, category: string): number {
		let total = 0;

		instance.commandHandler.commands.forEach(command => {
			if (command.category === category) {
				total++;
			}
		})

		return total;
	}

	capitalize(s: string) {
		if (typeof s !== 'string') return ''
		return s.charAt(0).toUpperCase() + s.slice(1)
	}
}