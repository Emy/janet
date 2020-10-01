import { MessageEmbed, TextChannel } from 'discord.js';
import { Event, EventStore, KlasaMessage } from 'klasa';

export default class extends Event {
    constructor(store: EventStore, file: string[], dir: string) {
        super(store, file, dir, {
            enabled: true,
        });
    }

    async run(msg: KlasaMessage) {
        if (msg.author.bot) return;
        const channelID = msg.guild.settings.get('channels.private');
        if (!channelID) return;
        if (!msg.content) return;
        if (msg.channel.id === channelID) return;
        for (const channel of msg.guild.settings.get('logging.excludedChannels')) {
            if (msg.channel.id === channel) return;
        }
        const embed = new MessageEmbed()
            .setTitle('Message Deleted')
            .setThumbnail(msg.author.avatarURL({ format: 'jpg' }))
            .setColor('#FF0000')
            .addField('User', `${msg.author.tag} (<@${msg.author.id}>)`, true)
            .addField('Channel', `<#${msg.channel.id}>`, true)
            .addField('Message', msg.content)
            .setFooter(msg.author.id)
            .setTimestamp();

        const channel = this.client.channels.cache.get(channelID) as TextChannel;
        channel.send(embed);
    }
}
