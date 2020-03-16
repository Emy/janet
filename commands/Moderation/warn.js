const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const Case = require('../../util/case');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      runIn: ['text'],
      requiredPermissions: [],
      requiredSettings: [],
      guarded: true,
      permissionLevel: 0,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<member:member> <points:integer> [reason:...string]',
      usageDelim: ' ',
      quotedStringSupport: false,
      subcommands: false
    });
  }

  async run(msg, [member, points, reason]) {
    let warnPoints = member.user.settings.warnPoints;
    await member.user.settings.update('warnPoints', warnPoints += points)
    const c = await Case(this.client, msg, member, {
      type: 'WARN',
      reason: reason,
      duration: null,
      warnPointsAdded: points
    });
    this.sendWarnEmbed(msg, member, points, reason, c);
    if (warnPoints >= 600) {
      if (!member.bannable) return msg.send('Could not ban.');
      await member.ban({ days: 1, reason: '600 or more Warnpoints reached.' });
      await this.sendBanEmbed(msg, member);
    }

    if (warnPoints >= 400 && !member.user.settings.warnKicked) {
      if (!member.kickable) return msg.send('Could not kick.');
      await member.kick('400 or more Warnpoints reached.');
      await member.user.settings.update('warnKicked', true);
      await this.sendKickEmbed(msg, member);
    }
  }

  async init() {}

  sendWarnEmbed(msg, member, points, reason = 'No reason.', c) {
    const logChId = msg.guild.settings.get('publicLogChannel');
    if (!logChId) return;
    const embed = new MessageEmbed()
      .setTitle('Member Warned')
      .setThumbnail(member.user.avatarURL( {format: 'jpg'} ))
      .setColor('ORANGE')
      .addField('Member', `${member.user.tag} (<@${member.user.id}>)`, true)
      .addField('Mod', msg.author.tag, true)
      .addField('Increase', points, true)
      .addField('Reason', reason)
      .setFooter(`Case #${c.id} | ${member.user.id}`)
      .setTimestamp()
      this.client.channels.cache.get(logChId).send(embed);
  }

  async sendKickEmbed(msg, member) {
    const c = await Case(this.client, msg, member, {
      type: 'KICK',
      modID: this.client.user.id,
      modTag: this.client.user.tag,
      reason: '400 or more Warnpoints reached.',
      duration: null,
      warnPointsAdded: points
    });
    const logChId = msg.guild.settings.get('publicLogChannel');
    if (!logChId) return;
    const embed = new MessageEmbed()
      .setTitle('Member Kicked')
      .setThumbnail(member.user.avatarURL( {format: 'jpg'} ))
      .setColor('ORANGE')
      .addField('Member', `${member.user.tag} (<@${member.user.id}>)`, true)
      .addField('Mod', msg.author.tag, true)
      .addField('Reason', '400 or more Warnpoints reached.')
      .setFooter(`Case #${c.id} | ${member.user.id}`)
      .setTimestamp()
      this.client.channels.cache.get(logChId).send(embed);
  }

  async sendBanEmbed(msg, member) {
    const c = await Case(this.client, msg, member.user, {
      type: 'BAN',
      modID: this.client.user.id,
      modTag: this.client.user.tag,
      reason: '600 or more Warnpoints reached.',
      duration: null,
      warnPointsAdded: points
    });
    const logChId = msg.guild.settings.get('publicLogChannel');
    if (!logChId) return;
    const embed = new MessageEmbed()
      .setTitle('Member Banned')
      .setThumbnail(member.user.avatarURL( {format: 'jpg'} ))
      .setColor('RED')
      .addField('Member', `${member.user.tag} (<@${member.user.id}>)`, true)
      .addField('Mod', msg.author.tag, true)
      .addField('Reason', '600 or more Warnpoints reached.')
      .setFooter(`Case #${c.id} | ${member.user.id}`)
      .setTimestamp()
      this.client.channels.cache.get(logChId).send(embed);
  }
};
