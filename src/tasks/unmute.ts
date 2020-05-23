import { MessageEmbed, TextChannel } from 'discord.js';
import { Task, TaskStore } from 'klasa';
import Case from '../util/case';

type unmuteData = {
    guildID: string;
    memberID: string;
};

export default class extends Task {
    constructor(store: TaskStore, file: string[], dir: string) {
        super(store, file, dir, { enabled: true });
    }

    async run(data: unmuteData) {
        const guild = this.client.guilds.get(data.guildID);
        if (!guild) return;
        const member = guild.members.get(data.memberID);
        if (!member) return;

        if (!member.roles.has(guild.settings.get('roles.muted') as string)) return;
        await member.roles.remove(guild.settings.get('roles.muted') as string);
        await member.user.settings.update('isMuted', false);

        const c = new Case({
            id: this.client.settings.get('caseID') as number,
            type: 'UNMUTE',
            date: Date.now(),
            until: undefined,
            modID: this.client.user.id,
            modTag: this.client.user.tag,
            reason: 'Temporary mute expired!',
            punishment: undefined,
            currentWarnPoints: member.user.settings.get('warnPoints') as number,
        });
        await this.client.settings.update('caseID', (this.client.settings.get('caseID') as number) + 1);
        await member.user.settings.update('cases', c, { arrayAction: 'add' });

        const channelID = guild.settings.get('channels.public') as string;
        if (!channelID) return;
        const embed = new MessageEmbed()
            .setTitle('Member Unmuted')
            .setThumbnail(member.user.avatarURL({ format: 'jpg' }))
            .setColor('GREEN')
            .addField('Member', `${member.user.tag} (<@${member.id}>)`)
            .addField('Mod', this.client.user.tag)
            .addField('Reason', 'Temporary mute expired!')
            .setFooter(`Case #${c.id} | ${member.id}`)
            .setTimestamp();

        const channel = this.client.channels.get(channelID as string) as TextChannel;
        channel.send(embed);

        return null;
    }
}
