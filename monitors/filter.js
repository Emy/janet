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
    const filteredWords = [];
    let highestPrio = -1;
    msg.guild.settings.filterWords.forEach((filterWord) => {
      if (!(msg.content.toLowerCase().indexOf(filterWord.word.toLowerCase()) > -1)) return;
      filteredWords.push(filterWord.word);
      if (!(highestPrio < filteredWord.priority)) return;
      highestPrio = filteredWord.priority;
    });
    if (filteredWords.length === 0) return;
    const excludedChannels = msg.guild.settings.get('excludedChannels');
    if (excludedChannels.some((excludedChannel) => msg.channel.id == excludedChannel)) return;
    
    console.log(filteredWords);
    console.log(highestPrio);
  }

  async init() {}
};
