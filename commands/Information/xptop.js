const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: [],
      requiredSettings: [],
      aliases: [],
      description: '',
      extendedHelp: 'No extended help available.',
    });
  }

  async run(msg, [...params]) {
    const leaderboard = this.client.users.cache.sort((a,b) => {
      if (a.settings.xp > b.settings.xp) return -1;
      if (a.settings.xp < b.settings.xp) return 1;
      return 0;
    }).array().slice(0, 10);
    let counter = 1;
    const embed = new MessageEmbed()
      .setTitle('Leaderboard');
    leaderboard.forEach((user) => {
      embed.addField(`#${counter++} - Level ${user.settings.level}`, `<@${user.id}>`)
    });
    msg.send(embed);
  }

  async init() {}

};
