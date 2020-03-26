import { MessageEmbed } from 'discord.js';
import { Command, CommandStore, KlasaClient, KlasaMessage } from 'klasa';

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
            requiredSettings: [],
            aliases: [],
            description: 'Views the Top 10 members with the most XP on server.',
            extendedHelp: 'No extended help available.',
        });
    }

    async run(msg: KlasaMessage) {
        if (!(await msg.hasAtLeastPermissionLevel(5))) {
            if (!msg.guild.settings.get('channels.botspam')) return;
            if (msg.channel.id != msg.guild.settings.get('channels.botspam')) {
                return msg.send(`Command only allowed in <#${msg.guild.settings.get('channels.botspam')}>`);
            }
        }
        const leaderboard = this.client.users.cache
            .sort((a, b) => {
                if (a.settings.get('xp') > b.settings.get('xp')) return -1;
                if (a.settings.get('xp') < b.settings.get('xp')) return 1;
                return 0;
            })
            .array()
            .slice(0, 10);
        let counter = 1;
        const embed = new MessageEmbed()
            .setTitle('Leaderboard')
            .setDescription(`${msg.guild.name}'s Leaderboard`)
            .setColor('GREEN')
            .setTimestamp();
        leaderboard.forEach((user) => {
            embed.addField(`#${counter++} - Level ${user.settings.get('level')}`, `<@${user.id}>`);
        });

        msg.delete();
        return msg.send(embed);
    }
}
