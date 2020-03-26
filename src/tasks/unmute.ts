import { MessageEmbed, TextChannel } from 'discord.js';
import { KlasaClient, Task, TaskStore } from 'klasa';
import Case from '../util/case';

export default class extends Task {
    constructor(client: KlasaClient, store: TaskStore, file: string[], dir: string) {
        super(client, store, file, dir, { enabled: true });
    }

    async run(data: any) {
        const guild = this.client.guilds.cache.get(data.guildID);
        if (!guild) return;
        const member = guild.members.cache.get(data.memberID);
        if (!member) return;

        if (!member.roles.cache.has(guild.settings.get('roles.muted'))) return;
        await member.roles.remove(guild.settings.get('roles.muted'));
        await member.user.settings.update('isMuted', false);

        const c = new Case({
            id: this.client.settings.get('caseID'),
            type: 'UNMUTE',
            date: Date.now(),
            until: undefined,
            modID: this.client.user.id,
            modTag: this.client.user.tag,
            reason: 'Temporary mute expired!',
            punishment: undefined,
            currentWarnPoints: member.user.settings.get('warnPoints'),
        });
        await this.client.settings.update('caseID', this.client.settings.get('caseID') + 1);
        await member.user.settings.update('cases', c, { action: 'add' });

        const channelID = guild.settings.get('channels.public');
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

        const channel = this.client.channels.cache.get(channelID) as TextChannel;
        channel.send(embed);

        return null;
    }
}
