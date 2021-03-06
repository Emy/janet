import { Command, CommandStore, KlasaMessage } from 'klasa';

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
            permissionLevel: 5,
            description: 'Option to be pinged of reportable actions when offline. (True will ping when offline.)',
            extendedHelp: '!offlineping <true | false>',
            usage: '<bool:boolean>',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false,
        });
    }

    async run(msg: KlasaMessage, [bool]: [boolean]) {
        msg.author.settings.update('offlineReportPing', bool);

        return msg.send(`Offline ping set to: ${bool}`);
    }
}
