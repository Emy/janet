import { Command, CommandStore, KlasaMessage } from 'klasa';
import JanetClient from '../../lib/client';
import Dispatcher from '../../util/dispatcher';

export default class extends Command {
    client: JanetClient;
    constructor(client: JanetClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: ['EMBED_LINKS'],
            cooldown: 5,
            description: (lang) => lang.get('SKIP_DESCRIPTION'),
        });
    }

    async run(msg: KlasaMessage) {
        if (!this.client.queue.get(msg.guild.id)) return msg.send('No music playing in here.');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher) return msg.send('I could not skip the track');
        dispatcher as Dispatcher;
        dispatcher.loop = false;
        if (dispatcher.player.stopTrack()) return msg.send('Skipped the track.');
        return msg.send('I could not skip the track');
    }
}
