import { TextChannel } from 'discord.js';
import { Command, CommandStore, KlasaClient, KlasaMessage } from 'klasa';

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: false,
            runIn: ['text'],
            requiredPermissions: [],
            requiredSettings: [],
            aliases: [],
            autoAliases: true,
            bucket: 1,
            cooldown: 0,
            promptLimit: 0,
            promptTime: 30000,
            deletable: false,
            guarded: false,
            nsfw: false,
            permissionLevel: 7,
            description: 'Locks the channel by blocking @everyone from sending messages.',
            extendedHelp: 'No extended help available.',
            usage: '',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false,
        });
    }

    async run(msg: KlasaMessage) {
        const everyone = msg.guild.roles.cache.first();
        const channel = msg.channel as TextChannel;
        const isLocked = channel.permissionsFor(everyone).has('SEND_MESSAGES');

        await channel.updateOverwrite(everyone, { SEND_MESSAGES: !isLocked });

        return msg.send(`Channel ${isLocked ? 'locked' : 'unlocked'}.`);
    }
}
