import { Command, CommandStore, KlasaMessage } from 'klasa';
import JanetClient from '../../lib/client';
import Dispatcher from '../../util/dispatcher';

export default class extends Command {
    client: JanetClient;
    constructor(store: CommandStore, file: string[], dir: string) {
        super(store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: [],
            aliases: ['l'],
            cooldown: 5,
            description: (lang) => lang.get('LOOP_DESCRIPTION'),
        });
    }

    async run(msg: KlasaMessage) {
        if (!(await msg.hasAtLeastPermissionLevel(5))) {
            if (!msg.guild.settings.get('channels.botspam')) return;
            if (msg.channel.id != msg.guild.settings.get('channels.botspam')) {
                return msg.send(`Command only allowed in <#${msg.guild.settings.get('channels.botspam')}>`);
            }
        }
        const dispatcher = this.client.queue.get(msg.guild.id) as Dispatcher;
        if (!dispatcher) return msg.send('No music playing in here.');
        if (msg.member.voice.channel.id != dispatcher.player.voiceConnection.voiceChannelID) {
            return msg.send('We need to be in the same voice channel.');
        }
        dispatcher.loop = !dispatcher.loop;
        return msg.send(`Loop is: ${dispatcher.loop}`);
    }
}
