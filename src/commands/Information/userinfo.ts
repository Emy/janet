import { GuildMember, MessageEmbed } from 'discord.js';
import { Command, CommandStore, KlasaClient, KlasaMessage, Timestamp } from 'klasa';

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: [],
            aliases: ['info'],
            description: 'Displays info of requested user.',
            extendedHelp: '!userinfo [optional: <userid | usertag>]',
            usage: '[member:member]',
        });
    }

    async run(msg: KlasaMessage, [member]: [GuildMember]) {
        if (!(await msg.hasAtLeastPermissionLevel(5))) {
            if (!msg.guild.settings.get('channels.botspam')) return;
            if (msg.channel.id != msg.guild.settings.get('channels.botspam')) {
                return msg.send(`Command only allowed in <#${msg.guild.settings.get('channels.botspam')}>`);
            }
        }
        if (!member) member = msg.member;

        let roles = '';
        member.roles.cache.map((r) => (r.name != '@everyone' ? (roles += `${r} `) : ''));

        const timestamp = new Timestamp('LLL');

        const joined = timestamp.display(member.joinedAt);
        const created = timestamp.display(member.user.createdAt);

        const embed = new MessageEmbed()
            .setTitle('User Information')
            .setColor(member.roles.highest.color)
            .setThumbnail(member.user.avatarURL({ format: 'jpg' }))
            .addField('Username', `${member.user.tag} (${member.user})`, true)
            .addField('Level', member.user.settings.get('level'), true)
            .addField('XP', member.user.settings.get('xp'), true)
            .addField('Roles', roles ? roles : 'No roles.')
            .addField('Joined', joined ? joined : 'N/A', true)
            .addField('Created', created ? created : 'N/A', true)
            .setFooter(member.user.id)
            .setTimestamp();
        msg.send(embed);
        msg.delete();
    }
}
