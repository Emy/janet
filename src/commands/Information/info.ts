import { Command, CommandStore, KlasaClient, KlasaMessage } from 'klasa';

export default class extends Command {

	constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
		super(client, store, file, dir, {
			enabled: false,
			aliases: ['details', 'what'],
			guarded: true,
			description: language => language.get('COMMAND_INFO_DESCRIPTION')
		});
	}

	async run(message: KlasaMessage) {
		return message.sendLocale('COMMAND_INFO');
	}

};
