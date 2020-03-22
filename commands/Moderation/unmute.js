const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const Case = require('../../util/case');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: [],
      requiredSettings: [],
      guarded: false,
      permissionLevel: 5,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<member:member> [reason:...string]',
      usageDelim: ' ',
    });
  }

  async run(msg, [member, reason]) {
    if (!member.roles.cache.has(msg.guild.settings.roles.muted)) return msg.send('Target is not muted.');
    if (!member.user.settings.isMuted) msg.send('Target not muted.')
    await member.roles.remove(msg.guild.settings.roles.muted);
    await member.user.settings.update('isMuted', false);
    const c = await this.buildCase(msg, reason, member.user);
    this.sendEmbed(msg, member, reason, c);
  }

  async init() {}

  async buildCase(msg, reason, user) {
    const c = new Case({
      id: this.client.settings.caseID,
      type: 'UNMUTE',
      date: Date.now(),
      until: undefined,
      modID: msg.author.id,
      modTag: msg.author.tag,
      reason: reason,
      punishment: undefined,
      currentWarnPoints: user.settings.warnPoints
    });
    await this.client.settings.update('caseID', this.client.settings.caseID + 1);
    await user.settings.update('cases', c, { action: 'add' });
    return c;
  }

  sendEmbed(msg, member, reason, c) {
    const channelID = msg.guild.settings.channels.public;
    if (!channelID) return;
    const embed = new MessageEmbed()
      .setTitle('Member Unmuted')
      .setThumbnail(member.user.avatarURL({format: 'jpg'}))
      .setColor('GREEN')
      .addField('Member', `${member.user.tag} (<@${member.id}>)`)
      .addField('Mod', msg.author.tag)
      .addField('Reason', reason ? reason : 'No reason.')
      .setFooter(`Case #${c.id} | ${member.id}`)
      .setTimestamp();
    return this.client.channels.cache.get(channelID).send(embed);
  }
};
