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
      permissionLevel: 0,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<member:member> [reason:...string]',
      usageDelim: ' ',
    });
  }

  async run(msg, [member, reason]) {
    if (!member.roles.cache.has(msg.guild.settings.roles.muted)) return;
    await member.roles.remove(msg.guild.settings.roles.muted);
    const c = await Case(this.client, msg, member.user, {
      type: 'UNMUTE',
      reason: reason,
      duration: null,
      warnPointsAdded: 0
    });
  }

  async init() {}

  sendEmbed() {
    const logChId = msg.guild.settings.publicLogChannel;
    if (!logChId) return;
    const embed = new MessageEmbed()
      .setTitle('Member Unmuted')
      .setThumbnail(member.user.avatarURL({format: 'jpg'}))
      .setColor('GREEN')
      .addField('Member', `${member.user.tag} (<@${member.id}>)`)
      .addField('Mod', msg.author.tag)
      .addField('Reason', reason ? reason : 'No reason.')
      .setFooter(`Case #${c.id} | ${member.id}`)
      .setTimestamp();
    return this.client.channels.cache.get(logChId).send(embed);
  }
};
