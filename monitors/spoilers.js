const { Monitor } = require('klasa');

module.exports = class extends Monitor {

  constructor(...args) {
    super(...args, {
      enabled: true,
      ignoreBots: true,
      ignoreSelf: true,
      ignoreOthers: false,
      ignoreWebhooks: true,
      ignoreEdits: false
    });
  }

  async run(msg) {
    if (!msg.guild.settings.filter.enableSpoilerFiltering) return;
    const regex = new RegExp(/\|{2}(.*)\|{2}/);
    const matches = regex.exec(msg.content);
    if (!matches) return;
    if (!msg.guild.settings.roles.moderator) return;
    if (msg.guild.settings.roles.moderator.position <= msg.author.role) return;
    await msg.delete();
  }

  async init() {}

};
