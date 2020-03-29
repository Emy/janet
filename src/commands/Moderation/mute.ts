import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Command, CommandStore, KlasaClient, KlasaMessage, KlasaUser } from 'klasa';
import moment from 'moment';
import Case from '../../util/case';

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: ['MANAGE_ROLES'],
            requiredSettings: [],
            guarded: true,
            permissionLevel: 5,
            description: 'Mutes a member with optional time and/or reason.',
            extendedHelp:
                '<usertag | userid> [optional: duration (m = minutes, h = hours, d = days)] [optional: reason]',
            usage: '<member:member> [duration:time] [reason:...string]',
            usageDelim: ' ',
        });
    }

    async run(msg: KlasaMessage, [member, duration, reason]: [GuildMember, Date, string]) {
        if (member.id === this.client.user.id) return msg.send('I cannot mute myself.');
        if (member.id === msg.author.id) return msg.send('You cannot mute yourself.');
        if (member.roles.highest.position >= msg.member.roles.highest.position)
            return msg.send('Your highest role is even or lower than the target users role.');
        if (member.roles.cache.has(msg.guild.settings.get('roles.muted'))) return msg.send('Target is already muted.');

        await member.roles.add(msg.guild.settings.get('roles.muted'));
        await member.user.settings.update('isMuted', true);

        const c = await this.buildCase(msg, reason, member.user, duration);

        if (duration) {
            await this.client.schedule.create('unmute', duration, {
                data: {
                    guildID: msg.guild.id,
                    memberID: member.id,
                },
                catchUp: true,
            });
        }

        this.sendEmbed(msg, member, reason, duration, c);
    }

    async buildCase(msg: KlasaMessage, reason: string, user: KlasaUser, duration: Date) {
        const c = new Case({
            id: this.client.settings.get('caseID'),
            type: 'MUTE',
            date: Date.now(),
            until: duration,
            modID: msg.author.id,
            modTag: msg.author.tag,
            reason: reason,
            punishment: duration ? moment().to(duration.toISOString(), true) : 'PERMANENT',
            currentWarnPoints: user.settings.get('warnPoints'),
        });
        await this.client.settings.update('caseID', this.client.settings.get('caseID') + 1);
        await user.settings.update('cases', c, { action: 'add' });
        return c;
    }

    sendEmbed(msg: KlasaMessage, member: GuildMember, reason: string, duration: Date, c: Case) {
        const channelID = msg.guild.settings.get('channels.public');
        if (!channelID) return 'logchannel';
        const embed = new MessageEmbed()
            .setTitle('Member Muted')
            .setThumbnail(member.user.avatarURL({ format: 'jpg' }))
            .setColor('RED')
            .addField('Member', `${member.user.tag} (<@${member.id}>)`, true)
            .addField('Mod', `${msg.author.tag} (<@${msg.author.id}>)`, true)
            .addField('Duration', duration ? moment().to(duration.toISOString(), true) : 'PERMANENT')
            .addField('Reason', reason ? reason : 'No reason.')
            .setFooter(`Case #${c.id} | ${member.id}`)
            .setTimestamp();

        const channel = this.client.channels.cache.get(channelID) as TextChannel;
        return channel.send(embed);
    }
}
