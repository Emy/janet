import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Event, EventStore, KlasaClient } from 'klasa';

export default class extends Event {
    constructor(client: KlasaClient, store: EventStore, file: string[], dir: string) {
        super(client, store, file, dir, {
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

        const channel = this.client.channels.cache.get(member.guild.settings.get('channels.private')) as TextChannel;
        channel.send(embed);
    }
}
