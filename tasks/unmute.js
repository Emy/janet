const { Task } = require('klasa');
const { MessageEmbed } = require('discord.js');
const Case = require('../util/case');

module.exports = class extends Task {

  constructor(...args) {
    super(...args, { enabled: true });
  }

  async run(data) {
    const guild = this.client.guilds.cache.get(data.guildID);
    if (!guild) return;
    const member = guild.members.cache.get(data.memberID);
    if (!member) return;

    if (!member.roles.cache.has(guild.settings.roles.muted)) return;
    await member.roles.remove(guild.settings.roles.muted);
    await member.user.settings.update('isMuted', false);

    const c = new Case({
      id: this.client.settings.caseID,
      type: 'UNMUTE',
      date: Date.now(),
      until: undefined,
      modID: this.client.user.id,
      modTag: this.client.user.tag,
      reason: 'Temporary mute expired!',
      punishment: undefined,
      currentWarnPoints: member.user.settings.warnPoints
    });
    await this.client.settings.update('caseID', this.client.settings.caseID + 1);
    await member.user.settings.update('cases', c, { action: 'add' });

    const channelID = guild.settings.channels.public;
    if (!channelID) return;
    const embed = new MessageEmbed()
      .setTitle('Member Unmuted')
      .setThumbnail(member.user.avatarURL({format: 'jpg'}))
      .setColor('GREEN')
      .addField('Member', `${member.user.tag} (<@${member.id}>)`)
      .addField('Mod', this.client.user.tag)
      .addField('Reason', 'Temporary mute expired!')
      .setFooter(`Case #${c.id} | ${member.id}`)
      .setTimestamp();
    return this.client.channels.cache.get(channelID).send(embed);
  }

  async init() {}
};
