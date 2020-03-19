const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const Case = require('../../util/case');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: ['BAN_MEMBERS'],
      aliases: [],
      guarded: true,
      permissionLevel: 7,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<user:user> [reason:...string]',
      usageDelim: ' ',
    });
  }

  async run(msg, [user, reason]) {
    const bannedPlayers = await msg.guild.fetchBans();
    if (!bannedPlayers.has(user.id)) return msg.send('Target is not banned.');
    await msg.guild.members.unban(user, reason);
    if (user.settings.warnPoints >= 600) user.settings.update('warnPoints', 450);

    const c = await this.buildCase(msg, reason, user);

    this.sendEmbed(msg, user, reason, c);
  }

  async init() {}

  async buildCase(msg, reason, user) {
    const c = new Case({
      id: this.client.settings.caseID,
      type: 'UNBAN',
      date: Date.now(),
      until: undefined,
      modID: msg.author.id,
      modTag: msg.author.tag,
      reason: reason,
      duration: null,
      warnPointsAdded: 0,
      currentWarnPoints: user.settings.warnPoints
    });
    await this.client.settings.update('caseID', this.client.settings.caseID + 1);
    await user.settings.update('cases', c, { action: 'add' });
    return c;
  }

  sendEmbed(msg, user, reason, c) {
    const channelID = msg.guild.settings.channels.public;
    if (!channelID) return 'logchannel';
    const embed = new MessageEmbed()
      .setTitle('Member Unbanned')
      .setThumbnail(user.avatarURL({ format: 'jpg' }))
      .setColor('GREEN')
      .addField('Member', user.tag, true)
      .addField('Mod', msg.author.tag, true)
      .addField('Reason', reason ? reason : 'No reason.')
      .setFooter(`Case #${c.id} | ${user.id}`)
      .setTimestamp();
      this.client.channels.cache.get(channelID).send(embed);
  }
};
