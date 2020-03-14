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
    logChId = msg.guild.settings.get('logChannel')
    if (!logChId) return;
    if (!newMsg.content || !oldMsg.content) return;
    const embed = new MessageEmbed()
      .setTitle('Message Updated')
      .setThumbnail(oldMsg.author.avatarURL({type: 'jpg'}))
      .setColor('BLUE')
      .addField('User', oldMsg.author.tag)
      .addField('Old Message', oldMsg.content)
      .addField('New Message', newMsg.content)
      .addField('Channel', `<#${oldMsg.channel.id}>`);
      this.client.channels.cache.get(logChId).send(embed);
  }

  async init() {}
};
