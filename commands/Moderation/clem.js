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
      permissionLevel: 7,
      description: 'Puts a member on Clem Protocol (Server and Bot Owner only)',
      extendedHelp: 'No extended help available.',
      usage: '<member:member> [reason:...string]',
      usageDelim: ' ',
    });
  }

  async run(msg, [member, reason]) {
    await member.user.settings.update('clem', true);
    await member.user.settings.update('xpFrozen', true);
    const warnPointDiff = 599 - member.user.settings.warnPoints;
    await member.user.settings.update('warnPoints', 599);
    const c = await this.buildCase(msg, reason, member.user, warnPointDiff)
    this.sendEmbed(msg, member, reason, c)


  }

  async init() {}

  async buildCase(msg, reason, user, warnPointDiff) {
    const c = new Case({
      id: this.client.settings.caseID,
      type: 'CLEM',
      date: Date.now(),
      until: undefined,
      modID: msg.author.id,
      modTag: msg.author.tag,
      reason: reason,
      punishment: warnPointDiff,
      currentWarnPoints: user.settings.warnPoints
    });
    await this.client.settings.update('caseID', this.client.settings.caseID + 1);
    await user.settings.update('cases', c, { action: 'add' });
    return c;
  }

  sendEmbed(msg, member, reason, c) {
    const channelID = msg.guild.settings.channels.private;
    if (!channelID) return;
    const embed = new MessageEmbed()
    .setTitle('Member Clemed')
    .setThumbnail(member.user.avatarURL( {format: 'jpg' }))
    .setColor('RED')
    .addField('Member', member.user.tag, true)
    .addField('Mod', msg.author.tag, true)
    .addField('Warn Points', member.user.settings.warnPoints)
    .addField('Reason', reason ? reason : 'No reason.')
    .setFooter(`Case #${c.id} | ${member.user.id}`)
    .setTimestamp();
    this.client.channels.cache.get(channelID).send(embed);
  }
};
