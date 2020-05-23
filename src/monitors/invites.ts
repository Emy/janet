import { KlasaClient, KlasaMessage, Monitor, MonitorStore } from 'klasa';

export default class extends Monitor {
    constructor(client: KlasaClient, store: MonitorStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            ignoreBots: true,
            ignoreSelf: true,
            ignoreOthers: false,
            ignoreWebhooks: true,
            ignoreEdits: false,
        });
    }

    async run(msg: KlasaMessage) {
        if (!msg.guildSettings.get('filter.enableInviteFiltering')) return;
        const regex = new RegExp(/discord.gg\/(.*).*/m);
        const matches = regex.exec(msg.content);
        if (!matches) return;
        if (matches[1].toLowerCase() !== 'jb') return msg.delete()
    }
}