import { Command, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {
    constructor(store: CommandStore, file: string[], dir: string) {
        super(store, file, dir, {
            enabled: false,
            aliases: ['details', 'what'],
            guarded: true,
            description: (language) => language.get('COMMAND_INFO_DESCRIPTION'),
        });
    }

    async run(message: KlasaMessage) {
        return message.sendLocale('COMMAND_INFO');
    }
}
