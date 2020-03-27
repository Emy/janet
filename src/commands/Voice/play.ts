import { Command, CommandStore, KlasaMessage } from 'klasa';
import { LoadTrackResponse } from 'shoukaku';
import JanetClient from '../../lib/client';

export default class extends Command {
    client: JanetClient;
    constructor(client: JanetClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: ['EMBED_LINKS'],
            aliases: ['p'],
            cooldown: 5,
            description: (lang) => lang.get('PLAY_DESCRIPTION'),
            usage: '<track:...string>',
            usageDelim: ' ',
        });
    }

    async run(msg: KlasaMessage, [song]: [string]) {
        if (!msg.member.voice.channel) return msg.send('NOT_IN_VC');
        const node = this.client.shoukaku.getNode();
        const tracks = await node.rest.resolve(song, 'youtube');
        if (!tracks) return msg.send('No tracks found.');
        if (Array.isArray(tracks)) {
            const dispatcher = await this.client.queue.handleTrack(node, tracks.shift(), msg);
            tracks.forEach((track) => {
                this.client.queue.handleTrack(node, track, msg);
            });
            // Added playlist
            if (dispatcher) await dispatcher.play();
            return null;
            // Now playing
        }

        // Should be a LoadTrackResponse at this point.
        const ltr = tracks as LoadTrackResponse;

        if (Array.isArray(ltr.tracks)) {
            const dispatcher = await this.client.queue.handleTrack(node, ltr.tracks[0], msg);
            if (dispatcher) await dispatcher.play();
        }

        return msg.send('hmm');
    }
}
