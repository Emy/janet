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
    if (!member.guild.settings.get('privateLogChannel')) return;
    const embed = new MessageEmbed()
    .setTitle('Member Joined')
    .setThumbnail(member.user.avatarURL({format: 'jpg'}))
    .setColor('GREEN')
    .addField('User', member.user.tag, true)
    .addField('Warnpoints', member.user.settings.warnPoints, true)
    .addField('Joined', member.joinedAt)
    .addField('Created', member.user.createdAt)
    .setTimestamp()
    .setFooter(member.user.id);
    this.client.channels.cache.get(member.guild.settings.get('privateLogChannel')).send(embed);

    if (member.user.settings.get('isMuted')) {
      await member.roles.add(member.guild.settings.roles.muted);
      embed.setTitle('Mute Evasion')
      .setColor('RED')
      this.client.channels.cache.get(member.guild.settings.get('privateLogChannel')).send(embed);
    }
  }

  async init() {}

};
