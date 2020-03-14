const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

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

    const logChId = msg.guild.settings.get('logChannel');
    if (!logChId) return 'logchannel';
    const embed = new MessageEmbed()
      .setTitle('Member Unbanned')
      .setThumbnail(user.avatarURL({ type: 'jpg' }))
      .setColor('GREEN')
      .addField('Member', user.tag, true)
      .addField('Mod', msg.author.tag, true)
      .addField('Reason', reason);
      this.client.channels.cache.get(logChId).send(embed);
  }

  async init() {}
};
