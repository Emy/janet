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
    const channelID = oldMsg.guild.settings.channels.private;
    if (!channelID) return;
    const embed = new MessageEmbed()
      .setTitle('Message Updated')
      .setThumbnail(oldMsg.author.avatarURL({format: 'jpg'}))
      .setColor('BLUE')
      .addField('User', oldMsg.author.tag)
      .addField('Old Message', oldMsg.content)
      .addField('New Message', newMsg.content)
      .addField('Channel', `<#${oldMsg.channel.id}>`)
      .setTimestamp();
      this.client.channels.cache.get(channelID).send(embed);
  }

  async init() {}
};
