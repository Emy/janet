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
        if (!msg.guild.settings.get('filter.enableSpoilerFiltering')) return;
        const roleID = msg.guild.settings.get('roles.moderator');
        if (roleID && msg.guild.roles.cache.get(roleID).position <= msg.member.roles.highest.position) return;
        await this.checkTextSpoiler(msg);
        await this.checkImageSpoiler(msg);
    }

    async checkTextSpoiler(msg: KlasaMessage) {
        const regex = new RegExp(/\|{2}(.*)\|{2}/);
        const matches = regex.exec(msg.content);
        if (!matches) return;
        return msg.delete();
    }

    async checkImageSpoiler(msg: KlasaMessage) {
        if (!msg.attachments) return;
        if (msg.attachments.some((attachment) => attachment.spoiler)) return msg.delete();
    }
}
