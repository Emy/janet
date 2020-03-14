const { Event } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {

  constructor(...args) {
    super(...args, {
      enabled: true,
      once: false
    });
  }

  async run(member) {
    if (!member.guild.settings.get('logChannel')) return;
    const embed = new MessageEmbed()
    .setTitle('Member Left')
    .setThumbnail(member.user.avatarURL({type: 'jpg'}))
    .setColor('RED')
    .addField('User', member.user.tag)
    this.client.channels.cache.get(member.guild.settings.get('logChannel')).send(embed);
  }

  async init() {}
};
