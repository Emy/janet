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
      guarded: false,
      permissionLevel: 0,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '[user:user]',
    });
  }

  async run(msg, [user]) {
    if (!user) user = msg.author;
    const embed = new MessageEmbed()
      .setTitle('Level Statistics')
      .setThumbnail(user.avatarURL({ type: 'jpg' }))
      .addField('Member', user.tag)
      .addField('Level', user.settings.get('level'), true)
      .addField('Experience Points', user.settings.get('xp'), true)
      .addField('Rank', '-', true); // 15 30 50 RANKS
    msg.send(embed);
  }

  async init() {}

};
