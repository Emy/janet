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
    const channelID = msg.guild.settings.channels.private;
    if (!channelID) return;
    if (!msg.content) return;
    if (msg.channel.id === channelID) return;
    for(let channel of msg.guild.settings.logging.excludedChannels) {
      if (msg.channel.id === channel) return;
    }
    const embed = new MessageEmbed()
    .setTitle('Message Deleted')
    .setThumbnail(msg.author.avatarURL({format: 'jpg'}))
    .setColor('#FF0000')
    .addField('User', `${msg.author.tag} (<@${msg.author.id}>)`, true)
    .addField('Channel', `<#${msg.channel.id}>`, true)
    .addField('Message', msg.content)
    .setFooter(msg.author.id)
    .setTimestamp();
    
    this.client.channels.cache.get(channelID).send(embed);
  }

  async init() {}
};
