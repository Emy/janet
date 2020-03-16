const { Event } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {

  constructor(...args) {
    super(...args, {
      enabled: true
    });
  }

  async run(oldMsg, newMsg) {
    if (oldMsg.author.bot) return;
    if (!newMsg.content || !oldMsg.content) return;
    if (oldMsg.content === newMsg.content) return;
    const logChId = oldMsg.guild.settings.get('privateLogChannel')
    if (!logChId) return;
    const embed = new MessageEmbed()
      .setTitle('Message Updated')
      .setThumbnail(oldMsg.author.avatarURL({format: 'jpg'}))
      .setColor('BLUE')
      .addField('User', oldMsg.author.tag)
      .addField('Old Message', oldMsg.content)
      .addField('New Message', newMsg.content)
      .addField('Channel', `<#${oldMsg.channel.id}>`)
      .setTimestamp();
      this.client.channels.cache.get(logChId).send(embed);
  }

  async init() {}
};
