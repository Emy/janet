import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Command, CommandStore, KlasaMessage, KlasaUser } from 'klasa';
import Case from '../../util/case';

export default class extends Command {
    constructor(store: CommandStore, file: string[], dir: string) {
        super(store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: [],
            requiredSettings: [],
            guarded: false,
            permissionLevel: 5,
            description: 'Unmutes a member.',
            extendedHelp: '!unmute <usertag | userid> [optional: reason]',
            usage: '<member:member> [reason:...string]',
            usageDelim: ' ',
        });
    }

    async run(msg: KlasaMessage, [member, reason]: [GuildMember, string]) {
        if (!member.roles.has(msg.guild.settings.get('roles.muted') as string)) return msg.send('Target is not muted.');
        if (!member.user.settings.get('isMuted')) msg.send('Target not muted.');
        await member.roles.remove(msg.guild.settings.get('roles.muted') as string);
        await member.user.settings.update('isMuted', false);
        const c = await this.buildCase(msg, reason, member.user);
        this.sendEmbed(msg, member, reason, c);
    }

    async buildCase(msg: KlasaMessage, reason: string, user: KlasaUser) {
        const c = new Case({
            id: this.client.settings.get('caseID') as number,
            type: 'UNMUTE',
            date: Date.now(),
            until: undefined,
            modID: msg.author.id,
            modTag: msg.author.tag,
            reason: reason,
            punishment: undefined,
            currentWarnPoints: user.settings.get('warnPoints') as number,
        });
        await this.client.settings.update('caseID', (this.client.settings.get('caseID') as number) + 1);
        await user.settings.update('cases', c, { arrayAction: 'add' });
        return c;
    }

    sendEmbed(msg: KlasaMessage, member: GuildMember, reason: string, c: Case) {
        const channelID = msg.guild.settings.get('channels.public');
        if (!channelID) return;
        const embed = new MessageEmbed()
            .setTitle('Member Unmuted')
            .setThumbnail(member.user.avatarURL({ format: 'jpg' }))
            .setColor('GREEN')
            .addField('Member', `${member.user.tag} (<@${member.id}>)`)
            .addField('Mod', `${msg.author.tag} (<@${msg.author.id}>)`)
            .addField('Reason', reason ? reason : 'No reason.')
            .setFooter(`Case #${c.id} | ${member.id}`)
            .setTimestamp();

        const channel = this.client.channels.get(channelID as string) as TextChannel;
        return channel.send(embed);
    }
}
