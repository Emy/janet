const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
      requiredSettings: [],
      aliases: [],
      description: 'Views the Top 10 members with the most XP on server.',
      extendedHelp: 'No extended help available.',
    });
  }

  async run(msg, [...params]) {
    if (!await msg.hasAtLeastPermissionLevel(5)) {
      if (!msg.guild.settings.channels.botspam) return;
      if(msg.channel.id != msg.guild.settings.channels.botspam) {
        return msg.send(`Command only allowed in <#${msg.guild.settings.channels.botspam}>`);
      }
    }
    const leaderboard = this.client.users.cache.sort((a,b) => {
      if (a.settings.xp > b.settings.xp) return -1;
      if (a.settings.xp < b.settings.xp) return 1;
      return 0;
    }).array().slice(0, 10);
    let counter = 1;
    const embed = new MessageEmbed()
      .setTitle('Leaderboard')
      .setDescription(`${msg.guild.name}'s Leaderboard`)
      .setColor('GREEN')
      .setTimestamp();
    leaderboard.forEach((user) => {
      embed.addField(`#${counter++} - Level ${user.settings.level}`, `<@${user.id}>`)
    });
    msg.send(embed);
  }

  async init() {}

};
