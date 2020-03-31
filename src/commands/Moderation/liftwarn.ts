import { GuildMember } from 'discord.js';
import { Command, CommandStore, KlasaClient, KlasaMessage, KlasaUser } from 'klasa';
import Case from '../../util/case';

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: false,
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
            description: 'Removes warn points from a previous case.',
            extendedHelp: '<usertag | userid> <amount> [optional: reason]',
            usage: '<member:member> <points:integer> [reason:...string]',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false,
        });
    }

    async run(msg: KlasaMessage, [member, points, reason]: [GuildMember, number, string]) {
        if (member.user.settings.get('warnPoints') < points) points = member.user.settings.get('warnPoints');
        await member.user.settings.update('warnPoints', points * -1);
        this.buildCase(msg, reason, points, member.user);

        return null;
    }

    async buildCase(msg: KlasaMessage, reason: string, points: number, user: KlasaUser) {
        const c = new Case({
            id: this.client.settings.get('caseID'),
            type: 'LIFTWARN',
            date: Date.now(),
            until: undefined,
            modID: msg.author.id,
            modTag: msg.author.tag,
            reason: reason,
            punishment: points,
            currentWarnPoints: user.settings.get('warnPoints'),
        });
        await this.client.settings.update('caseID', this.client.settings.get('caseID') + 1);
        await user.settings.update('cases', c, { action: 'add' });
        return c;
    }
}
// .setColor('DARK_ORANGE')