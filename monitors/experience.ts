import { KlasaClient, KlasaMessage, Monitor, MonitorStore } from 'klasa';

export default class extends Monitor {

  constructor(client: KlasaClient, store: MonitorStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      enabled: true,
      ignoreBots: true,
      ignoreSelf: true,
      ignoreOthers: false,
      ignoreWebhooks: true,
      ignoreEdits: true
    });
  }

  async run(message: KlasaMessage) {
    if (message.author.settings.get('xpFrozen')) return;
    let gainedXP = Math.floor(Math.random() * 10 + 1)
    //if (message.member.lastMessage.content === message.content) gainedXP = gainedXP * -1;
    const currentXP = message.author.settings.get('xp');
    await message.author.settings.update('xp', currentXP + gainedXP);
    await message.author.settings.update('level', this.getLevel(currentXP + gainedXP))
  }

  async init() {}

  getLevel(userXP: number) {
    let level = 0
    let xp = 0;
    while (xp <= userXP){
        xp = xp + 45 * level * (Math.floor(level / 10) + 1)
        level++
    }
    return level;
  }
};
