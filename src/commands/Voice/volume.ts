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
            cooldown: 5,
            description: (lang) => lang.get('VOLUME_DESCRIPTION'),
            usage: '[volume:int]',
        });
    }

    async run(msg: KlasaMessage, [volume]: [number]) {
        if (!this.client.queue.get(msg.guild.id)) return msg.send('No music playing in here.');
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher) return msg.send('I could not change the volume');
        if (volume > 200 || volume < 1) return msg.send('Volume restriction 1%-200%');
        dispatcher as Dispatcher;
        await dispatcher.player.setVolume(volume);
        return msg.send(`Set volume to ${volume}`);
    }
}
