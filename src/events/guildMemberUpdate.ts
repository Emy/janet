import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import ASCIIFolder from 'fold-to-ascii';
import { Event, EventStore } from 'klasa';
import JanetClient from '../lib/client';

export default class extends Event {
    client: JanetClient;
    constructor(client: JanetClient, store: EventStore, file: string[], dir: string) {
        super(store, file, dir, {
            enabled: true,
            once: false,
        });
    }

    async run(oldMember: GuildMember, newMember: GuildMember) {
        if (!(oldMember || newMember)) return;
        if (oldMember.nickname != newMember.nickname) return this.nickNameChange(oldMember, newMember);
        if (newMember.roles.cache.size != oldMember.roles.cache.size) return this.roleChange(oldMember, newMember);
    }

    nickNameChange(oldMember: GuildMember, newMember: GuildMember) {
        const channelID = oldMember.guild.settings.get('channels.private');
        if (!channelID) return;

        const nick = ASCIIFolder.foldMaintaining(newMember.displayName).toLowerCase();

        if (oldMember.guild.settings.get('filter.enableWordFiltering')) {
            for (const filteredWord of oldMember.guild.settings.get('filter.words')) {
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

        const channel = this.client.channels.cache.get(channelID) as TextChannel;
        channel.send(embed);
    }

    roleChange(oldMember: GuildMember, newMember: GuildMember) {
        const channelID = oldMember.guild.settings.get('channels.private');
        if (!channelID) return;
        const newRole = newMember.roles.cache.difference(oldMember.roles.cache);

        newRole.delete(newMember.guild.settings.get('roles.member'));
        if (newRole.size < 1) return;

        const embedTitle =
            newMember.roles.cache.size > oldMember.roles.cache.size ? 'Member Role Added' : 'Member Role Removed';

        const embed = new MessageEmbed()
            .setTitle(embedTitle)
            .setThumbnail(oldMember.user.avatarURL({ format: 'jpg' }))
            .setColor('BLUE')
            .addField('Member', `${oldMember.user.tag} (<@${oldMember.id}>)`)
            .addField('Role', `${newRole.map((role) => role.name)}`, true)
            .setFooter(oldMember.user.id)
            .setTimestamp();

        const channel = this.client.channels.cache.get(channelID) as TextChannel;
        channel.send(embed);
    }
}
