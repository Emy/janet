import { Command, CommandStore, KlasaMessage } from 'klasa';
import FilteredWord from '../../util/filteredWord';

export default class extends Command {
    constructor(store: CommandStore, file: string[], dir: string) {
        super(store, file, dir, {
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
            permissionLevel: 6,
            description: 'Adds word to filter list with silent or reportable delete.',
            extendedHelp:
                '!filter <true | false> <role priority to be excluded> <string> True = Should Report, False = Silent Delete',
            usage: '<notify:boolean> <bypass:integer> <word:...string>',
            usageDelim: ' ',
            quotedStringSupport: false,
            subcommands: false,
        });
    }

    async run(msg: KlasaMessage, [notify, bypass, word]: [boolean, number, string]) {
        const fw = new FilteredWord({
            notify: notify,
            bypass: bypass,
            word: word,
        });
        await msg.guild.settings.update('filter.words', fw, { action: 'add' });

        msg.send(`Added ${word} ${notify ? 'with' : 'without'} notifications and bypass level ${bypass}.`);

        return null;
    }
}
