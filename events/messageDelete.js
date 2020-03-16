const { Event } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {

  constructor(...args) {
    super(...args, {
      enabled: true
    });
  }

  async run(msg) {
    if (msg.author.bot) return;
    const logChId = msg.guild.settings.get('privateLogChannel')
    if (!logChId) return;
    if (!msg.content) return;
    if (msg.channel.id === logChId) return;
    const embed = new MessageEmbed()
    .setTitle('Message Deleted')
    .setThumbnail(msg.author.avatarURL({format: 'jpg'}))
    .setColor('RED')
    .addField('User', msg.author.tag, true)
    .addField('Channel', `<#${msg.channel.id}>`, true)
    .addField('Message', msg.content)
    .setTimestamp();
    
    this.client.channels.cache.get(logChId).send(embed);
  }

  async init() {}
};
