import { Command, CommandStore, KlasaMessage } from 'klasa';
import JanetClient from '../../lib/client';

module.exports = class extends Command {
    client: JanetClient;
    constructor(client: JanetClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: ['EMBED_LINKS'],
            aliases: ['leave'],
            cooldown: 5,
            description: (lang) => lang.get('STOP_DESCRIPTION'),
        });
    }

    async run(msg: KlasaMessage) {
        const dispatcher = this.client.queue.get(msg.guild.id);
        if (!dispatcher) return;
        dispatcher.onEvent();
        return msg.send('I am stopping the music.');
    }
};
