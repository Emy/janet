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
      permissionLevel: 0,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<user:user> [reason:...string]',
      usageDelim: ' ',
    });
  }

  async run(msg, [user, reason]) {
    const bannedPlayers = await msg.guild.fetchBans();
    if (!bannedPlayers.has(user.id)) return;
    await msg.guild.members.unban(user, reason);

    const c = await Case(this.client, msg, user, {
      type: 'UNBAN',
      reason: reason,
      duration: null,
      warnPointsAdded: 0
    });

    this.sendEmbed(msg, user, reason, c);
  }

  async init() {}

  sendEmbed(msg, user, reason, c) {
    const logChId = msg.guild.settings.get('publicLogChannel');
    if (!logChId) return 'logchannel';
    const embed = new MessageEmbed()
      .setTitle('Member Unbanned')
      .setThumbnail(user.avatarURL({ format: 'jpg' }))
      .setColor('GREEN')
      .addField('Member', user.tag, true)
      .addField('Mod', msg.author.tag, true)
      .addField('Reason', reason ? reason : 'No reason.')
      .setFooter(`Case #${c.id} | ${user.id}`)
      .setTimestamp();
      this.client.channels.cache.get(logChId).send(embed);
  }
};
