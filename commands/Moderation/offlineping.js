const { Command } = require('klasa');

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
      description: 'Option to be pinged of reportable actions when offline. (True will ping when offline.)',
      extendedHelp: '!offlineping <true | false>',
      usage: '<bool:boolean>',
      usageDelim: undefined,
      quotedStringSupport: false,
      subcommands: false
    });
  }

  async run(msg, [bool]) {
    msg.author.settings.update('offlineReportPing', bool);
    msg.send(`Offline ping set to: ${bool}`);
    msg.delete();
  }

  async init() {}

};
