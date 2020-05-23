import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Event, EventStore } from 'klasa';

export default class extends Event {
    constructor(store: EventStore, file: string[], dir: string) {
        super(store, file, dir, {
            enabled: true,
            once: false,
        });
    }

    async run(member: GuildMember) {
        if (!member.guild.settings.get('channels.private')) return;
        const embed = new MessageEmbed()
            .setTitle('Member Left')
            .setThumbnail(member.user.avatarURL({ format: 'jpg' }))
            .setColor('#9012FE')
            .addField('User', `${member.user.tag} (<@${member.user.id}>)`)
            .setFooter(member.user.id)
            .setTimestamp();

        const channel = this.client.channels.get(
            member.guild.settings.get('channels.private') as string,
        ) as TextChannel;
        channel.send(embed);
    }
}
