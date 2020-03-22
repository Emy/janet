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
      permissionLevel: 5,
      description: 'Warn a member with points.',
      extendedHelp: '!warn <usertag | userid> <amount> [optional: reason]',
      usage: '<member:member> <points:integer> [reason:...string]',
      usageDelim: ' ',
      quotedStringSupport: false,
      subcommands: false
    });
  }

  async run(msg, [member, points, reason]) {
    if (points <= 0) return msg.send('🤔');
    let warnPoints = member.user.settings.warnPoints;
    if (member.roles.highest.position >= msg.member.roles.highest.position) return msg.send('Your highest role is even or lower than the target users role.');
    await member.user.settings.update('warnPoints', warnPoints += points)
    const c = await this.buildCase(msg, reason, points, member.user);

    this.sendWarnEmbed(msg, member, points, reason, c);
    if (warnPoints >= 600) {
      if (!member.bannable) return msg.send('Could not ban.');
      await member.ban({ days: 1, reason: '600 or more Warnpoints reached.' });
      await this.sendBanEmbed(msg, member, points);
    }

    if (warnPoints >= 400 && !member.user.settings.warnKicked) {
      if (!member.kickable) return msg.send('Could not kick.');
      await member.kick('400 or more Warnpoints reached.');
      await member.user.settings.update('warnKicked', true);
      await this.sendKickEmbed(msg, member, points);
    }
  }

  async init() {}

  async buildCase(msg, reason, points, user) {
    const c = new Case({
      id: this.client.settings.caseID,
      type: 'WARN',
      date: Date.now(),
      until: undefined,
      modID: msg.author.id,
      modTag: msg.author.tag,
      reason: reason,
      punishment: points,
      currentWarnPoints: user.settings.warnPoints
    });
    await this.client.settings.update('caseID', this.client.settings.caseID + 1);
    await user.settings.update('cases', c, { action: 'add' });
    return c;
  }

  sendWarnEmbed(msg, member, points, reason = 'No reason.', c) {
    const channelID = msg.guild.settings.channels.public;
    if (!channelID) return;
    const embed = new MessageEmbed()
      .setTitle('Member Warned')
      .setThumbnail(member.user.avatarURL( {format: 'jpg'} ))
      .setColor('ORANGE')
      .addField('Member', `${member.user.tag} (<@${member.user.id}>)`, true)
      .addField('Mod', `${msg.author.tag} (<@${msg.author.id}>)`, true)
      .addField('Increase', points, true)
      .addField('Reason', reason)
      .setFooter(`Case #${c.id} | ${member.user.id}`)
      .setTimestamp()
      this.client.channels.cache.get(channelID).send(embed);
  }

  async sendKickEmbed(msg, member, points) {
    const c = new Case({
      id: this.client.settings.caseID,
      type: 'KICK',
      date: Date.now(),
      until: undefined,
      modID: this.client.user.id,
      modTag: this.client.user.tag,
      reason: '400 or more Warnpoints reached.',
      punishment: undefined,
      currentWarnPoints: member.user.settings.warnPoints
    });
    await this.client.settings.update('caseID', this.client.settings.caseID + 1);
    await member.user.settings.update('cases', c, { action: 'add' });
    const channelID = msg.guild.settings.channels.public;
    if (!channelID) return;
    const embed = new MessageEmbed()
      .setTitle('Member Kicked')
      .setThumbnail(member.user.avatarURL( {format: 'jpg'} ))
      .setColor('ORANGE')
      .addField('Member', `${member.user.tag} (<@${member.user.id}>)`, true)
      .addField('Mod', msg.author.tag, true)
      .addField('Reason', '400 or more Warnpoints reached.')
      .setFooter(`Case #${c.id} | ${member.user.id}`)
      .setTimestamp()
      this.client.channels.cache.get(channelID).send(embed);
  }

  async sendBanEmbed(msg, member, points) {
    const c = new Case({
      id: this.client.settings.caseID,
      type: 'BAN',
      date: Date.now(),
      until: undefined,
      modID: this.client.user.id,
      modTag: this.client.user.tag,
      reason: '600 or more Warnpoints reached.',
      punishment: 'PERMANENT',
      currentWarnPoints: member.user.settings.warnPoints
    });
    await this.client.settings.update('caseID', this.client.settings.caseID + 1);
    await member.user.settings.update('cases', c, { action: 'add' });
    const channelID = msg.guild.settings.channels.public;
    if (!channelID) return;
    const embed = new MessageEmbed()
      .setTitle('Member Banned')
      .setThumbnail(member.user.avatarURL( {format: 'jpg'} ))
      .setColor('RED')
      .addField('Member', `${member.user.tag} (<@${member.user.id}>)`, true)
      .addField('Mod', msg.author.tag, true)
      .addField('Reason', '600 or more Warnpoints reached.')
      .setFooter(`Case #${c.id} | ${member.user.id}`)
      .setTimestamp()
      this.client.channels.cache.get(channelID).send(embed);
  }
};
