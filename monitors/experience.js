const { Monitor } = require('klasa');

module.exports = class extends Monitor {

  constructor(...args) {
    super(...args, {
      enabled: true,
      ignoreBots: true,
      ignoreSelf: true,
      ignoreOthers: false,
      ignoreWebhooks: true,
      ignoreEdits: true
    });
  }

  async run(message) {
    if (message.author.settings.xpFrozen) return;
    let gainedXP = Math.floor(Math.random() * 10 + 1)
    //if (message.member.lastMessage.content === message.content) gainedXP = gainedXP * -1;
    const currentXP = message.author.settings.xp;
    await message.author.settings.update('xp', currentXP + gainedXP);
    await message.author.settings.update('level', this.getLevel(currentXP + gainedXP))
  }

  async init() {}

  getLevel(userXP) {
    let level = 0
    let xp = 0;
    while (xp <= userXP){
        xp = xp + 45 * level * (Math.floor(parseInt(level) / 10) + 1)
        level++
    }
    return level;
  }
};
