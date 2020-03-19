const { Command } = require('klasa');
const FilteredWord = require('../../util/filteredWord')

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: [],
      requiredSettings: [],
      aliases: [],
      autoAliases: true,
      bucket: 1,
      cooldown: 0,
      promptLimit: 0,
      promptTime: 30000,
      deletable: false,
      guarded: false,
      nsfw: false,
      permissionLevel: 5,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<priority:integer> <word:...string>',
      usageDelim: ' ',
      quotedStringSupport: false,
      subcommands: false
    });
  }

  async run(msg, [priority, word]) {
    const fw = new FilteredWord({
      word: word,
      priority: priority
    });
    await msg.guild.settings.update('filter.words', fw, { action: 'add' });
    msg.send(`Added ${word} with priority ${priority}.`);
  }

  async init() {}
};
