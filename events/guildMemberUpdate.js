const { Event } = require('klasa');
const { MessageEmbed } = require('discord.js');
const ASCIIFolder = require('fold-to-ascii');

module.exports = class extends Event {

  constructor(...args) {
    super(...args, {
      enabled: true,
      once: false
    });
  }

  async run(oldMember, newMember) {
    if (!(oldMember || newMember)) return;
    if (oldMember.nickname != newMember.nickname) {
      const channelID = oldMember.guild.settings.channels.private;
      if (!channelID) return;

      const nick = ASCIIFolder.foldMaintaining(newMember.displayName).toLowerCase();

      if (oldMember.guild.settings.filter.enableWordFiltering) {
        for (let filteredWord of oldMember.guild.settings.filter.words) {
          if (!nick.includes(filteredWord.word.toLowerCase())) continue;
          newMember.setNickname('change name pls', 'filtered word');
        }
      }

      const embed = new MessageEmbed()
        .setTitle('Member Renamed')
        .setThumbnail(oldMember.user.avatarURL({ format: 'jpg' }))
        .setColor('ORANGE')
        .addField('Member', `${oldMember.user.tag} (<@${oldMember.id}>)`)
        .addField('Old Nickname', oldMember.nickname ? oldMember.nickname : 'No Nickname', true)
        .addField('New Nickname', newMember.nickname ? newMember.nickname : 'No Nickname', true)
        .setFooter(oldMember.user.id)
        .setTimestamp();
        this.client.channels.cache.get(channelID).send(embed);
    }

    if (newMember.roles.cache.size != oldMember.roles.cache.size) {
      const channelID = oldMember.guild.settings.channels.private;
      if (!channelID) return;
      let newRole = newMember.roles.cache.difference(oldMember.roles.cache)
      let embedTitle = (newMember.roles.cache.size > oldMember.roles.cache.size) ? 'Member Role Added' : 'Member Role Removed'

      const embed = new MessageEmbed()
          .setTitle(embedTitle)
          .setThumbnail(oldMember.user.avatarURL({ format: 'jpg' }))
          .setColor('BLUE')
          .addField('Member', `${oldMember.user.tag} (<@${oldMember.id}>)`)
          .addField('Role', `${newRole.map(role => role.name)}`, true)
          .setFooter(oldMember.user.id)
          .setTimestamp();
      this.client.channels.cache.get(channelID).send(embed);
      }
  }

  async init() {}

};
