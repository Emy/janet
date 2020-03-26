import { Command, CommandStore, KlasaClient, KlasaMessage } from 'klasa';
import FilteredWord from '../../util/filteredWord';

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: [],
            requiredSettings: [],
            aliases: [],
            autoAliases: true,
            bucket: 1,
            cooldown: 0,
            promptLimit: 0,
            promptTime: 30000,
            deletable: false,
            guarded: false,
            nsfw: false,
            permissionLevel: 5,
            description: 'Adds word to filter list with silent or reportable delete.',
            extendedHelp: '!filter <0 | 1> <string to filter> 0 = Silent, 1 = Report',
            usage: '<priority:integer> <word:...string>',
            usageDelim: ' ',
            quotedStringSupport: false,
            subcommands: false,
        });
    }

    async run(msg: KlasaMessage, [priority, word]: [number, string]) {
        const fw = new FilteredWord({
            word: word,
            priority: priority,
        });
        await msg.guild.settings.update('filter.words', fw, { action: 'add' });

        msg.send(`Added ${word} with priority ${priority}.`);
        msg.delete();

        return null;
    }
}
