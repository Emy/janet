const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: [],
      requiredSettings: [],
      guarded: false,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '[user:user]',
    });
  }

  async run(msg, [user]) {
    if (!user) user = msg.author
    const embed = new MessageEmbed()
      .setTitle('Warn Points')
      .setColor('ORANGE')
      .setThumbnail(user.avatarURL({ type: 'jpg' }))
      .addField('Member', user.tag)
      .addField('Warn Points', user.settings.get('warnPoints'));
    msg.send(embed);
  }

  async init() {}

};
