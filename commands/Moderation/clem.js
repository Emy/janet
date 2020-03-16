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
      aliases: [],
      autoAliases: true,
      bucket: 1,
      cooldown: 0,
      promptLimit: 0,
      promptTime: 30000,
      deletable: false,
      guarded: false,
      nsfw: false,
      permissionLevel: 0,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<member:member> [reason:...string]',
      usageDelim: ' ',
    });
  }

  async run(msg, [member, reason]) {
    await user.settings.update('clem', true);
    await user.settings.update('xpFrozen', true);
    const warnPointDiff = 599 - user.settings.warnPoints;
    await user.settings.update('warnPoints', 599);
    const c = await Case(this.client, msg, member.user, {
      type: 'CLEM',
      reason: reason,
      duration: null,
      warnPointsAdded: warnPointDiff
    });
    this.sendEmbed(msg, member, reason, c)


  }

  async init() {}

  sendEmbed(msg, member, reason, c) {
    const logChId = msg.guild.settings.get('privateLogChannel');
    if (!logChId) return;
    const embed = new MessageEmbed()
    .setTimestamp('Member Clemed')
    .setThumbnail(member.user.avatarURL( {format: 'jpg' }))
    .setColor('RED')
    .addField('Member', member.user.tag, true)
    .addField('Mod', msg.author.tag, true)
    .addField('Warn Points', member.user.settings.get('warnPoints'))
    .addField('Reason', reason ? reason : 'No reason.')
    .setFooter(`Case #${c.id} | ${member.user.id}`)
    .setTimestamp();
    this.client.channels.cache.get(logChId).send(embed);
  }
};
