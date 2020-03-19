const { Command, RichDisplay } = require('klasa');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: [],
      requiredSettings: [],
      aliases: ['caselog', 'caselogs'],
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
      usage: '<user:user>',
      usageDelim: undefined,
      quotedStringSupport: false,
      subcommands: false
    });
  }

  async run(msg, [user]) {
    const display = new RichDisplay()
    let counter = 0;
    let embed = new MessageEmbed();
    user.settings.cases.forEach((c) => {
      embed.addField(
        `#${c.id} ${c.type} - Mod: ${c.modTag} Reason: ${c.reason}`,
        `At: ${moment(new Date(c.date).toISOString()).format('LL')}`);
        counter++;
        if (counter % 10 == 0) {
          display.addPage(embed);
          embed = new MessageEmbed();
        }
    });
    if (counter % 10 !== 0) display.addPage(embed);

    display.run(msg);

    console.log(user.settings.cases);
  }

  async init() {}

};
