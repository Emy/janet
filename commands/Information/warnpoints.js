const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
      requiredSettings: [],
      guarded: false,
      permissionLevel: 5,
      description: 'Views total warnpoints of member.',
      extendedHelp: '!warnpoints [optional: <usertag | userid>]',
      usage: '[user:user]',
    });
  }

  async run(msg, [user]) {
    if (!user) user = msg.author
    const embed = new MessageEmbed()
      .setTitle('Warn Points')
      .setColor('ORANGE')
      .setThumbnail(user.avatarURL({ format: 'jpg' }))
      .addField('Member', `${user.tag} (<@${user.id}>)`)
      .addField('Warn Points', user.settings.get('warnPoints'))
      .setFooter(user.id)
      .setTimestamp();
    msg.send(embed);
  }

  async init() {}

};
