const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: ['KICK_MEMBERS'],
      guarded: true,
      permissionLevel: 0,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '<member:member> [reason:...string]',
      usageDelim: ' ',
    });
  }

  async run(msg, [member, reason]) {
    if (member.id === this.client.user.id) return 'bot not kickable';
    if (member.id === msg.author.id) return 'cant kick yourself';
    if (member.roles.highest.position >= msg.member.roles.highest.position) return 'role height';
    if (!member.kickable) return 'not kickable';
    await member.kick(reason);

    const logChId = msg.guild.settings.get('logChannel');
    if (!logChId) return 'logchannel';
    const embed = new MessageEmbed()
      .setTitle('Member Kicked')
      .setThumbnail(member.user.avatarURL({type: 'jpg'}))
      .setColor('RED')
      .addField('Member', `${member.user.tag} (<@${member.id}>)`)
      .addField('Mod', msg.author.tag)
      .addField('Reason', reason)
    this.client.channels.cache.get(logChId).send(embed);
  }

  async init() {}
};
