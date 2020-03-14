const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

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
      permissionLevel: 0,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<user:user> [reason:...string]',
      usageDelim: ' ',
    });
  }

  async run(msg, [user, reason]) {
    user.settings.update('isClem', true);
    user.settings.update('warnPoints', 599);

    const embed = new MessageEmbed()
      .setTimestamp('Member Clemed')
      .setThumbnail(user.avatarURL( {type: 'jpg' }))
      .setColor('RED')
      .addField('Member', user.tag, true)
      .addField('Mod', msg.author.tag, true)
      .addField('Warn Points', user.settings.get('warnPoints'))
      .addField('Reason', reason ? reason : 'No reason.');
    msg.send(embed);
  }

  async init() {}
};
