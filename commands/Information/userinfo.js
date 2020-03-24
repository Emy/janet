const { Command, Timestamp } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: [],
      aliases: ['info'],
      description: 'Displays info of requested user.',
      extendedHelp: '!userinfo [optional: <userid | usertag>]',
      usage: '[member:member]',
    });
  }

  async run(msg, [member]) {
    if (!await msg.hasAtLeastPermissionLevel(5)) {
      if (!msg.guild.settings.channels.botspam) return;
      if(msg.channel.id != msg.guild.settings.channels.botspam) {
        return msg.send(`Command only allowed in <#${msg.guild.settings.channels.botspam}>`);
      }
    }
    if (!member) member = msg.member;

    let roles = '';
    member.roles.cache.map((r) => r.name != '@everyone' ? roles += `${r} ` : '');

    const timestamp = new Timestamp('LLL')

    const embed = new MessageEmbed()
      .setTitle('User Information')
      .setColor(member.roles.highest.color)
      .setThumbnail(member.user.avatarURL({ format: 'jpg' }))
      .addField('Username', `${member.user.tag} (${member.user})`, true)
      .addField('Level', member.user.settings.level, true)
      .addField('XP', member.user.settings.xp, true)
      .addField('Roles', roles)
      .addField('Joined', timestamp.display(member.joinedAt), true)
      .addField('Created', timestamp.display(member.user.createdAt), true)
      .setFooter(member.user.id)
      .setTimestamp();
    msg.send(embed);
    msg.delete();
  }

  async init() {}

};
