import { Command, CommandStore, KlasaMessage } from 'klasa';
import JanetClient from '../../lib/client';
import Dispatcher from '../../util/dispatcher';

export default class extends Command {
    client: JanetClient;
    constructor(client: JanetClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: [],
            aliases: ['l'],
            cooldown: 5,
            description: (lang) => lang.get('LOOP_DESCRIPTION'),
        });
    }

    async run(msg: KlasaMessage) {
        if (!this.client.queue.get(msg.guild.id)) return msg.send('No music playing in here.');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher) return msg.send('I could not loop/unloop');
        dispatcher as Dispatcher;
        dispatcher.loop = !dispatcher.loop;
        return msg.send(`Loop is: ${dispatcher.loop}`);
    }
}
