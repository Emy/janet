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
      permissionLevel: 0,
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
    const c = await Case(this.client, msg, member.user, {
      type: 'BAN',
      reason: reason,
      duration: null,
      warnPointsAdded: 0
    });
    this.sendEmbed(msg, member, reason, c);
  }

  async init() {}

  sendEmbed(msg, member, reason, c) {
    const logChId = msg.guild.settings.get('publicLogChannel');
    if (!logChId) return;
    const embed = new MessageEmbed()
      .setTitle('Member Banned')
      .setThumbnail(member.user.avatarURL({format: 'jpg'}))
      .setColor('RED')
      .addField('Member', `${member.user.tag} (<@${member.id}>)`)
      .addField('Mod', msg.author.tag)
      .addField('Reason', reason ? reason : 'No reason.')
      .setFooter(`Case #${c.id} | ${member.id}`)
      .setTimestamp();
    this.client.channels.cache.get(logChId).send(embed);
  }
};
