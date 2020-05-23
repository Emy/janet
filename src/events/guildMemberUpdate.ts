import { GuildMember, MessageEmbed, TextChannel, Collection, Role } from 'discord.js';
import ASCIIFolder from 'fold-to-ascii';
import { Event, EventStore } from 'klasa';
import FilteredWord from '../util/filteredWord';

export default class extends Event {
    constructor(store: EventStore, file: string[], dir: string) {
        super(store, file, dir, {
            enabled: true,
            once: false,
        });
    }

    async run(oldMember: GuildMember, newMember: GuildMember) {
        if (!(oldMember || newMember)) return;
        if (oldMember.nickname != newMember.nickname) return this.nickNameChange(oldMember, newMember);
        if (newMember.roles.size != oldMember.roles.size) return this.roleChange(oldMember, newMember);
    }

    nickNameChange(oldMember: GuildMember, newMember: GuildMember) {
        const channelID = oldMember.guild.settings.get('channels.private');
        if (!channelID) return;

        const nick = ASCIIFolder.foldMaintaining(newMember.displayName).toLowerCase();

        if (oldMember.guild.settings.get('filter.enableWordFiltering')) {
            for (const filteredWord of oldMember.guild.settings.get('filter.words') as FilteredWord[]) {
                if (!nick.includes(filteredWord.word.toLowerCase())) continue;
                newMember.setNickname('change name pls', 'filtered word');
            }
        }

        const embed = new MessageEmbed()
            .setTitle('Member Renamed')
            .setThumbnail(oldMember.user.avatarURL({ format: 'jpg' }))
            .setColor('ORANGE')
            .addField('Member', `${oldMember.user.tag} (<@${oldMember.id}>)`)
            .addField('Old Nickname', oldMember.nickname ? oldMember.nickname : 'No Nickname', true)
            .addField('New Nickname', newMember.nickname ? newMember.nickname : 'No Nickname', true)
            .setFooter(oldMember.user.id)
            .setTimestamp();

        const channel = this.client.channels.get(channelID as string) as TextChannel;
        channel.send(embed);
    }

    roleChange(oldMember: GuildMember, newMember: GuildMember) {
        const channelID = oldMember.guild.settings.get('channels.private');
        if (!channelID) return;
        const newRole = newMember.roles.difference((oldMember.roles as unknown) as Collection<string, Role>);

        newRole.delete(newMember.guild.settings.get('roles.member') as string);
        if (newRole.size < 1) return;

        const embedTitle = newMember.roles.size > oldMember.roles.size ? 'Member Role Added' : 'Member Role Removed';

        const embed = new MessageEmbed()
            .setTitle(embedTitle)
            .setThumbnail(oldMember.user.avatarURL({ format: 'jpg' }))
            .setColor('BLUE')
            .addField('Member', `${oldMember.user.tag} (<@${oldMember.id}>)`)
            .addField('Role', `${newRole.map((role) => role.name)}`, true)
            .setFooter(oldMember.user.id)
            .setTimestamp();

        const channel = this.client.channels.get(channelID as string) as TextChannel;
        channel.send(embed);
    }
}
