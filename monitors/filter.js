const { Monitor } = require('klasa');

module.exports = class extends Monitor {

  constructor(...args) {
    super(...args, {
      enabled: true,
      ignoreBots: false,
      ignoreSelf: true,
      ignoreOthers: false,
      ignoreWebhooks: true,
      ignoreEdits: false
    });
  }

  async run(msg) {
    const offensiveWords = msg.guild.settings.get('filterWords');
    const excludedChannels = msg.guild.settings.get('filterExcludedChannels');
    // if (excludedChannels && excludedChannels.some((excludedChannel) => msg.channel.id == excludedChannel)) return '';
    if (offensiveWords.some((offensiveWord) => msg.content.toLowerCase().indexOf(offensiveWord.toLowerCase()) > -1)) {
      msg.send('real nigga hours')
    }
  }

  async init() {}
};
