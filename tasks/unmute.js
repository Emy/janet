const { Task } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Task {

  constructor(...args) {
    super(...args, { enabled: true });
  }

  async run(data) {
    const guild = this.client.guilds.cache.get(data.guildID);
    if (!guild) return;
    const member = guild.members.cache.get(data.memberID);
    if (!member) return;

    if (!member.roles.cache.has(guild.settings.roles.muted)) return;
    await member.roles.remove(guild.settings.roles.muted);

    const logChId = guild.settings.get('publicLogChannel');
    if (!logChId) return;
    const embed = new MessageEmbed()
      .setTitle('Member Unmuted')
      .setThumbnail(member.user.avatarURL({format: 'jpg'}))
      .setColor('GREEN')
      .addField('Member', `${member.user.tag} (<@${member.id}>)`)
      .addField('Mod', this.client.user.tag)
      .addField('Reason', 'Temporary mute expired!')
      .setTimestamp();
    return this.client.channels.cache.get(logChId).send(embed);
  }

  async init() {}
};
