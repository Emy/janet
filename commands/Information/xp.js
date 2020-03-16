const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: [],
      requiredSettings: [],
      aliases: ['xpstats'],
      guarded: false,
      permissionLevel: 0,
      description: '',
      extendedHelp: 'No extended help available.',
      usage: '[user:user]',
    });
  }

  async run(msg, [user]) {
    if (!user) user = msg.author;

    const leaderboard = this.client.users.cache.sort((a,b) => {
      if (a.settings.xp > b.settings.xp) return -1;
      if (a.settings.xp < b.settings.xp) return 1;
      return 0;
    }).array();

    let rank = 0;
    leaderboard.some((u) => {
      rank++;
      return u.id === user.id;
    });

    const embed = new MessageEmbed()
      .setTitle('Level Statistics')
      .setThumbnail(user.avatarURL({ format: 'jpg' }))
      .addField('Member', user.tag)
      .addField('Level', user.settings.get('level'), true)
      .addField('Experience Points', user.settings.get('xp'), true)
      .addField('Rank', `${rank} / ${leaderboard.length}`, true);
    msg.send(embed);
  }

  async init() {}

};
