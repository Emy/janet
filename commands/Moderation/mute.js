const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const Case = require('../../util/case');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: ['MANAGE_ROLES'],
      requiredSettings: [],
      guarded: true,
      permissionLevel: 0,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<member:member> [duration:time] [reason:...string]',
      usageDelim: ' ',
    });
  }

  async run(msg, [member, duration, reason]) {
    if (member.id === this.client.user.id) return 'bot not mutable';
    if (member.id === msg.author.id) return 'cant mute yourself';
    if (member.roles.highest.position >= msg.member.roles.highest.position) return 'role height';
    if (member.roles.cache.has(msg.guild.settings.roles.muted)) return 'already muted';

    await member.roles.add(msg.guild.settings.roles.muted);

    const c = await Case(this.client, msg, member.user, {
      type: 'MUTE',
      reason: reason,
      duration: duration ? duration : null,
      warnPointsAdded: 0
    });

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

  sendEmbed(msg, member, reason, duration, c) {
    const logChId = msg.guild.settings.get('publicLogChannel');
    if (!logChId) return 'logchannel';
    const embed = new MessageEmbed()
      .setTitle('Member Muted')
      .setThumbnail(member.user.avatarURL({format: 'jpg'}))
      .setColor('RED')
      .addField('Member', `${member.user.tag} (<@${member.id}>)`)
      .addField('Mod', msg.author.tag)
      .addField('Duration', duration ? duration : 'PERMANENT')
      .addField('Reason', reason ? reason : 'No reason.')
      .setFooter(`Case #${c.id} | ${member.id}`)
      .setTimestamp();
    return this.client.channels.cache.get(logChId).send(embed);
  }

};
