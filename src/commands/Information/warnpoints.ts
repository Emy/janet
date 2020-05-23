import { MessageEmbed } from 'discord.js';
import { Command, CommandStore, KlasaMessage, KlasaUser } from 'klasa';

export default class extends Command {
    constructor(store: CommandStore, file: string[], dir: string) {
        super(store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
            requiredSettings: [],
            guarded: false,
            permissionLevel: 5,
            description: 'Views total warnpoints of member.',
            extendedHelp: '!warnpoints [optional: <usertag | userid>]',
            usage: '[user:user]',
        });
    }

    async run(msg: KlasaMessage, [user]: [KlasaUser]) {
        if (!user) user = msg.author;

        const embed = new MessageEmbed()
            .setTitle('Warn Points')
            .setColor('ORANGE')
            .setThumbnail(user.avatarURL({ format: 'jpg' }))
            .addField('Member', `${user.tag} (<@${user.id}>)`)
            .addField('Warn Points', user.settings.get('warnPoints'))
            .setFooter(user.id)
            .setTimestamp();

        return msg.send(embed);
    }
}
