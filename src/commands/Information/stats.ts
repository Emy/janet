import { MessageEmbed } from 'discord.js';
import { Command, CommandStore, Duration, KlasaClient, KlasaMessage } from 'klasa';

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            guarded: true,
            description: (language) => language.get('COMMAND_STATS_DESCRIPTION'),
        });
    }

    async run(msg: KlasaMessage) {
        if (!(await msg.hasAtLeastPermissionLevel(5))) {
            if (!msg.guild.settings.get('channels.botspam')) return;
            if (msg.channel.id != msg.guild.settings.get('channels.botspam')) {
                return msg.send(`Command only allowed in <#${msg.guild.settings.get('channels.botspam')}>`);
            }
        }
        let [users, memory] = [0, 0];

        if (this.client.shard) {
            const results = await this.client.shard.broadcastEval(
                `[this.users.cache.size, (process.memoryUsage().heapUsed / 1024 / 1024)]`,
            );
            for (const result of results) {
                users += result[0];
                memory += result[3];
            }
        }

        const embed = new MessageEmbed()
            .setTitle('Statistics')
            .setThumbnail(this.client.user.avatarURL({ format: 'jpg' }))
            .setColor('GREEN')
            .addField('Users', users || this.client.users.cache.size, true)
            .addField('Memory', `${(memory || process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, true)
            .addField('Uptime', Duration.toNow(Date.now() - process.uptime() * 1000), true)
            .setTimestamp();
        msg.send(embed);
    }
}
