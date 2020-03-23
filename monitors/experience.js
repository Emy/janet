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
    if (!message.guild) return;
    if (message.author.settings.xpFrozen) return;
    let gainedXP = Math.floor(Math.random() * 10 + 1)
    //if (message.member.lastMessage.content === message.content) gainedXP = gainedXP * -1;
    const currentXP = message.author.settings.xp;
    await message.author.settings.update('xp', currentXP + gainedXP);
    await message.author.settings.update('level', this.getLevel(currentXP + gainedXP));

    if (message.author.settings.level >= 15 && message.guild.settings.roles.memberplus) {
      await message.member.roles.add(message.guild.settings.roles.memberplus);
    }

    if (message.author.settings.level >= 30 && message.guild.settings.roles.memberpro) {
      await message.member.roles.add(message.guild.settings.roles.memberpro);
    }

    if (message.author.settings.level >= 50 && message.guild.settings.roles.memberedition) {
      await message.member.roles.add(message.guild.settings.roles.memberedition)
    }
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
