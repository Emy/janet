const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Case = require('../../util/case');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: ['MANAGE_ROLES'],
      requiredSettings: [],
      guarded: true,
      permissionLevel: 5,
      description: 'Mutes a member with optional time and/or reason.',
      extendedHelp: '<usertag | userid> [optional: duration (m = minutes, h = hours, d = days)] [optional: reason]',
      usage: '<member:member> [duration:time] [reason:...string]',
      usageDelim: ' ',
    });
  }

  async run(msg, [member, duration, reason]) {
    if (member.id === this.client.user.id) return msg.send('I cannot mute myself.');
    if (member.id === msg.author.id) return msg.send('You cannot mute yourself.');
    if (member.roles.highest.position >= msg.member.roles.highest.position) return msg.send('Your highest role is even or lower than the target users role.');
    if (member.roles.cache.has(msg.guild.settings.roles.muted)) return msg.send('Target is already muted.');

    await member.roles.add(msg.guild.settings.roles.muted);
    await member.user.settings.update('isMuted', true);

    const c = await this.buildCase(msg, reason, member.user, duration);

    if (duration) {
      await this.client.schedule.create('unmute', duration, {
        data: {
          guildID: msg.guild.id,
          memberID: member.id
      },
      catchUp: true
      });
    }

    this.sendEmbed(msg, member, reason, duration, c)
  }

  async init() {}

  async buildCase(msg, reason, user, duration) {
    const c = new Case({
      id: this.client.settings.caseID,
      type: 'MUTE',
      date: Date.now(),
      until: duration,
      modID: msg.author.id,
      modTag: msg.author.tag,
      reason: reason,
      punishment: duration ? moment().to(duration.toISOString(), true) : 'PERMANENT',
      currentWarnPoints: user.settings.warnPoints
    });
    await this.client.settings.update('caseID', this.client.settings.caseID + 1);
    await user.settings.update('cases', c, { action: 'add' });
    return c;
  }

  sendEmbed(msg, member, reason, duration, c) {
    const channelID = msg.guild.settings.channels.public;
    if (!channelID) return 'logchannel';
    const embed = new MessageEmbed()
      .setTitle('Member Muted')
      .setThumbnail(member.user.avatarURL({format: 'jpg'}))
      .setColor('RED')
      .addField('Member', `${member.user.tag} (<@${member.id}>)`)
      .addField('Mod', msg.author.tag)
      .addField('Duration', duration ? moment().to(duration.toISOString(), true) : 'PERMANENT')
      .addField('Reason', reason ? reason : 'No reason.')
      .setFooter(`Case #${c.id} | ${member.id}`)
      .setTimestamp();
    return this.client.channels.cache.get(channelID).send(embed);
  }

};
