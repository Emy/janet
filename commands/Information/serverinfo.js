const { Command, Timestamp } = require('klasa');
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: [],
    });
  }

  async run(msg, [...params]) {
    const timestamp = new Timestamp('LLL');

    const embed = new MessageEmbed()
      .setTitle('Server Information')
      .setThumbnail(msg.guild.iconURL({ format: 'png', dynamic: true }))
      .setColor(msg.guild.roles.highest.color)
      .setDescription(`**${msg.guild.name}**`)
      .addField('Region', msg.guild.region, true)
      .addField('Boost Tier', msg.guild.premiumTier, true)
      .addField('Users', msg.guild.memberCount, true)
      .addField('Channels', msg.guild.channels.cache.size, true)
      .addField('Roles', msg.guild.roles.cache.size, true)
      .addField('Owner', msg.guild.owner, true)
      .addField('Verified', msg.guild.verified, true)
      .addField('Created', timestamp.display(msg.guild.createdAt))
      .setFooter(msg.guild.id)
      .setTimestamp();

      msg.send(embed);
  }

  async init() {}

};
