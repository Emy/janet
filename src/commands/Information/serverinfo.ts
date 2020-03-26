import { MessageEmbed } from 'discord.js';
import { Command, CommandStore, KlasaClient, KlasaMessage, Timestamp } from 'klasa';

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: [],
        });
    }

    async run(msg: KlasaMessage) {
        const timestamp = new Timestamp('LLL');

        const embed = new MessageEmbed()
            .setTitle('Server Information')
            .setThumbnail(msg.guild.iconURL({ format: 'png', dynamic: true }))
            .setColor(msg.guild.roles.highest.color)
            .setDescription(`**${msg.guild.name}**`)
            .addField('Region', msg.guild.region, true)
            .addField('Boost Tier', msg.guild.premiumTier, true)
            .addField('Users', msg.guild.memberCount, true)
            .addField('Channels', msg.guild.channels.cache.size, true)
            .addField('Roles', msg.guild.roles.cache.size, true)
            .addField('Owner', msg.guild.owner, true)
            .addField('Verified', msg.guild.verified, true)
            .addField('Created', timestamp.display(msg.guild.createdAt))
            .setFooter(msg.guild.id)
            .setTimestamp();

        msg.send(embed);
        msg.delete();
        return null;
    }
}
