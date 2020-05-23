import { Command, CommandStore, KlasaMessage } from 'klasa';
import FilteredWord from '../../util/filteredWord';

export default class extends Command {
    constructor(store: CommandStore, file: string[], dir: string) {
        super(store, file, dir, {
            enabled: true,
            runIn: ['text', 'dm'],
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
            permissionLevel: 4,
            description: 'Views the list of filtered words.',
            extendedHelp: '[show notify] [show only this bypass level]',
            usage: '[notify:boolean] [bypass:integer]',
            usageDelim: ' ',
            quotedStringSupport: false,
            subcommands: false,
        });
    }

    async run(msg: KlasaMessage, [notify, bypass]: [boolean, number]) {
        let content = 'Filterwords: ';
        (msg.guild.settings.get('filter.words') as FilteredWord[]).forEach((fw: FilteredWord) => {
            const output = `**${fw.word}** [${fw.notify} - ${fw.bypass}], `;

            if (notify == undefined) content += output;

            if (notify == fw.notify && bypass == undefined) content += output;
            if (notify == fw.notify && bypass == fw.bypass) content += output;
        });

        return msg.send(content);
    }
}
