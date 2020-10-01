import { KlasaMessage, Monitor, MonitorStore } from 'klasa';

export default class extends Monitor {
    constructor(store: MonitorStore, file: string[], dir: string) {
        super(store, file, dir, {
            enabled: true,
            ignoreBots: true,
            ignoreSelf: false,
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
        if (!/\|{2}[\S\s]+\|{2}/gm.test(msg.content)) return;
        return msg.delete();
    }

    async checkImageSpoiler(msg: KlasaMessage) {
        if (!msg.attachments) return;
        if (msg.attachments.some((attachment) => attachment.spoiler)) return msg.delete();
    }
}
