const { Event } = require('klasa');
const { MessageEmbed } = require('discord.js');

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
    

  }

  async init() {}

};
