const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: ['BAN_MEMBERS'],
      guarded: true,
      permissionLevel: 0,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<member:member> [reason:...string]',
      usageDelim: ' ',
    });
  }

  async run(msg, [member, reason]) {
    if (member.id === this.client.user.id) return 'bot not bannable';
    if (member.id === msg.author.id) return 'cant ban yourself';
    if (member.roles.highest.position >= msg.member.roles.highest.position) return 'role height';
    if (!member.bannable) return 'not bannable';
    await member.ban({days: 7, reason: reason});

    const logChId = msg.guild.settings.get('logChannel');
    if (!logChId) return 'logchannel';
    const embed = new MessageEmbed()
      .setTitle('Member Banned')
      .setThumbnail(member.user.avatarURL({type: 'jpg'}))
      .setColor('RED')
      .addField('Member', `${member.user.tag} (<@${member.id}>)`)
      .addField('Mod', msg.author.tag)
      .addField('Reason', reason)
    this.client.channels.cache.get(logChId).send(embed);
  }

  async init() {}
};
