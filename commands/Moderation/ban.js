const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const Case = require('./../../util/case')

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: ['BAN_MEMBERS'],
      guarded: true,
      permissionLevel: 5,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<member:member> [reason:...string]',
      usageDelim: ' ',
    });
  }

  async run(msg, [member, reason]) {
    if (member.id === this.client.user.id) return msg.send('I cannot ban myself.');
    if (member.id === msg.author.id) return msg.send('You cannot ban yourself.');
    if (member.roles.highest.position >= msg.member.roles.highest.position) return msg.send('Your highest role is even or lower than the target users role.');
    if (!member.bannable) return msg.send('The target is not bannable.');
    await member.ban({days: 1, reason: reason ? reason : 'No reason.'});
    const c = await this.buildCase(msg, reason, member.user);
    this.sendEmbed(msg, member, reason, c);
  }

  async init() {}

  async buildCase(msg, reason, user) {
    const c = new Case({
      id: this.client.settings.caseID,
      type: 'BAN',
      date: Date.now(),
      until: undefined,
      modID: msg.author.id,
      modTag: msg.author.tag,
      reason: reason,
      punishment: 'PERMANENT',
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
      .setTitle('Member Banned')
      .setThumbnail(member.user.avatarURL({format: 'jpg'}))
      .setColor('RED')
      .addField('Member', `${member.user.tag} (<@${member.id}>)`)
      .addField('Mod', msg.author.tag)
      .addField('Reason', reason ? reason : 'No reason.')
      .setFooter(`Case #${c.id} | ${member.id}`)
      .setTimestamp();
    this.client.channels.cache.get(channelID).send(embed);
  }
};
