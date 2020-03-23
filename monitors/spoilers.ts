import { KlasaClient, KlasaMessage, Monitor, MonitorStore } from 'klasa';

export default class extends Monitor {

  constructor(client: KlasaClient, store: MonitorStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      enabled: true,
      ignoreBots: true,
      ignoreSelf: true,
      ignoreOthers: false,
      ignoreWebhooks: true,
      ignoreEdits: false
    });
  }

  async run(msg: KlasaMessage) {
    if (!msg.guild.settings.get('filter.enableSpoilerFiltering')) return;
    const regex = new RegExp(/\|{2}(.*)\|{2}/);
    const matches = regex.exec(msg.content);
    if (!matches) return;
    if (!msg.guild.settings.get('roles.moderator')) return;
    if (msg.guild.settings.get('roles.moderator').position <= msg.author.role) return;
    await msg.delete();
  }

  async init() {}

};
