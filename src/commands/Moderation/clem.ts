import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Command, CommandStore, KlasaClient, KlasaMessage, KlasaUser } from 'klasa';
import Case from '../../util/case';

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
            permissionLevel: 7,
            description: 'Puts a member on Clem Protocol (Server and Bot Owner only)',
            extendedHelp: 'No extended help available.',
            usage: '<member:member> [reason:...string]',
            usageDelim: ' ',
        });
    }

    async run(msg: KlasaMessage, [member, reason]: [GuildMember, string]) {
        await member.user.settings.update('clem', true);
        await member.user.settings.update('xpFrozen', true);
        await member.user.settings.update('xp', 0);
        await member.user.settings.update('level', 0);
        const warnPointDiff = 599 - member.user.settings.get('warnPoints');
        await member.user.settings.update('warnPoints', 599);
        const c = await this.buildCase(msg, reason, member.user, warnPointDiff);

        this.sendEmbed(msg, member, reason, c);

        return null;
    }

    async buildCase(msg: KlasaMessage, reason: string, user: KlasaUser, warnPointDiff: number) {
        const c = new Case({
            id: this.client.settings.get('caseID'),
            type: 'CLEM',
            date: Date.now(),
            until: undefined,
            modID: msg.author.id,
            modTag: msg.author.tag,
            reason: reason,
            punishment: warnPointDiff,
            currentWarnPoints: user.settings.get('warnPoints'),
        });

        await this.client.settings.update('caseID', this.client.settings.get('caseID') + 1);
        await user.settings.update('cases', c, { action: 'add' });
        return c;
    }

    sendEmbed(msg: KlasaMessage, member: GuildMember, reason: string, c: Case) {
        const channelID = msg.guild.settings.get('channels.private');
        if (!channelID) return;
        const embed = new MessageEmbed()
            .setTitle('Member Clemed')
            .setThumbnail(member.user.avatarURL({ format: 'jpg' }))
            .setColor('RED')
            .addField('Member', `${member.user.tag} (${member})`, true)
            .addField('Mod', `${msg.author.tag} (<@${msg.author.id}>)`, true)
            .addField('Warn Points', member.user.settings.get('warnPoints'))
            .addField('Reason', reason ? reason : 'No reason.')
            .setFooter(`Case #${c.id} | ${member.user.id}`)
            .setTimestamp();

        const channel = this.client.channels.cache.get(channelID) as TextChannel;
        channel.send(embed);
    }
}
