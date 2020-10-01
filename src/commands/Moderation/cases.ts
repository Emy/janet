import { MessageEmbed } from 'discord.js';
import { Command, CommandStore, KlasaMessage, KlasaUser, RichDisplay } from 'klasa';
import moment from 'moment';
import Case from '../../util/case';

export default class extends Command {
    constructor(store: CommandStore, file: string[], dir: string) {
        super(store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: [],
            requiredSettings: [],
            aliases: ['caselog', 'caselogs'],
            autoAliases: true,
            bucket: 1,
            cooldown: 0,
            promptLimit: 0,
            promptTime: 30000,
            deletable: false,
            guarded: false,
            nsfw: false,
            permissionLevel: 5,
            description: 'Views cases performed on a member.',
            extendedHelp: '!cases <usertag | userid>',
            usage: '<user:user>',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false,
        });
    }

    async run(msg: KlasaMessage, [user]: [KlasaUser]) {
        const display = new RichDisplay();
        let counter = 0;
        let embed = new MessageEmbed();
        await user.settings.sync();
        user.settings.get('cases').forEach((c: Case) => {
            embed.addField(
                `#${c.id} ${c.type} - Mod: ${c.modTag} Reason: ${c.reason} Punishment: ${c.punishment}`,
                `At: ${moment(new Date(c.date).toISOString()).format('LL')}`,
            );
            counter++;
            if (counter % 10 == 0) {
                display.addPage(embed);
                embed = new MessageEmbed();
            }
        });
        if (counter % 10 !== 0) display.addPage(embed);

        display.run(msg);

        return null;
    }
}
