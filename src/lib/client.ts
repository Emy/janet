import { Client, KlasaClient, KlasaClientOptions } from 'klasa';
import { Shoukaku } from 'shoukaku';
import Queue from '../util/queue';

const shoukakuConfig = {
    moveOnDisconnect: true,
    resumable: true,
    resumableTimeout: 30,
    reconnectTries: 10,
    restTimeout: 10000,
};

const shoukakuNodes = [
    {
        name: process.env.VOICE_NAME,
        host: process.env.VOICE_HOST,
        port: parseInt(process.env.VOICE_PORT),
        auth: process.env.VOICE_PASSWORD,
    },
];

export default class JanetClient extends KlasaClient {
    shoukaku: Shoukaku;
    queue: Queue;
    constructor(options: KlasaClientOptions) {
        super(options);
        Client.defaultClientSchema.add('caseID', 'integer', { default: 0, min: 0, configurable: false });
        Client.defaultGuildSchema
            .add('roles', (folder) => {
                folder.add('muted', 'role');
                folder.add('member', 'role');
                folder.add('memberplus', 'role');
                folder.add('memberpro', 'role');
                folder.add('memberedition', 'role');
                folder.add('genius', 'role');
                folder.add('moderator', 'role');
            })
            .add('channels', (folder) => {
                folder.add('public', 'textchannel');
                folder.add('private', 'textchannel');
                folder.add('reports', 'textchannel');
                folder.add('botspam', 'textchannel');
            })
            .add('filter', (folder) => {
                folder.add('enableWordFiltering', 'boolean', { default: true }),
                    folder.add('enableSpoilerFiltering', 'boolean', { default: true });
                folder.add('words', 'filteredword', { array: true, configurable: false });
                folder.add('excludedChannels', 'textchannel', { array: true });
            })
            .add('logging', (folder) => {
                folder.add('excludedChannels', 'textchannel', { array: true });
            });
        Client.defaultUserSchema
            .add('isMuted', 'boolean', { default: false, configurable: false })
            .add('clem', 'boolean', { default: false, configurable: false })
            .add('xpFrozen', 'boolean', { default: false, configurable: false })
            .add('warnKicked', 'boolean', { default: false, configurable: false })
            .add('warnPoints', 'integer', { default: 0, min: 0, configurable: false })
            .add('xp', 'integer', { default: 0, min: 0, configurable: false })
            .add('level', 'integer', { default: 0, min: 0, configurable: false })
            .add('cases', 'any', { array: true, configurable: false })
            .add('offlineReportPing', 'boolean', { default: false, configurable: false });
        this.shoukaku = new Shoukaku(this, shoukakuNodes, shoukakuConfig);
        this.queue = new Queue(this);
        this.shoukaku.on('ready', (name, resumed) =>
            console.log(
                `Lavalink Node: ${name} is now connected. This connection is ${
                    resumed ? 'resumed' : 'a new connection'
                }`,
            ),
        );
        this.shoukaku.on('error', (name, error) => console.log(`Lavalink Node: ${name} emitted an error.`, error));
        this.shoukaku.on('close', (name, code, reason) =>
            console.log(`Lavalink Node: ${name} closed with code ${code}. Reason: ${reason || 'No reason'}`),
        );
        this.shoukaku.on('disconnected', (name, reason) =>
            console.log(`Lavalink Node: ${name} disconnected. Reason: ${reason || 'No reason'}`),
        );
    }
}
