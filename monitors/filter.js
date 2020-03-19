const { Monitor } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Monitor {

  constructor(...args) {
    super(...args, {
      enabled: true,
      ignoreBots: false,
      ignoreSelf: true,
      ignoreOthers: false,
      ignoreWebhooks: true,
      ignoreEdits: false
    });
  }

  async run(msg) {
    if (!msg.guild.settings.filter.enableWordFiltering) return;
    const filteredWords = [];
    let highestPrio = -1;
    msg.guild.settings.filter.words.forEach((filterWord) => {
      if (!(msg.content.toLowerCase().indexOf(filterWord.word.toLowerCase()) > -1)) return;
      filteredWords.push(filterWord.word);
      if (!(highestPrio < filterWord.priority)) return;
      highestPrio = filterWord.priority;
    });
    if (filteredWords.length === 0) return;
    const excludedChannels = msg.guild.settings.filter.excludedChannels;
    if (excludedChannels.some((excludedChannel) => msg.channel.id == excludedChannel)) return;

    await msg.delete();
    if (highestPrio <= 0) return;
    const membersToPing = [];
    msg.guild.roles.cache.get(msg.guild.settings.roles.moderator).members.map((member) => {
      if (!(member.presence.status === 'online' || member.presence.status === 'idle' || member.user.settings.offlineReportPing)) return;
      membersToPing.push(member);
    });

    const channelID = msg.guild.settings.channels.reports;
    if (membersToPing.length > 0) {
      let content = '';
      membersToPing.forEach((member) => {
        content+= `<@${member.user.id}> `;
      })
      this.client.channels.cache.get(channelID).send(content);
    }
    if (!channelID) return;
    const embed = new MessageEmbed()
      .setTitle('Word filter')
      .setThumbnail(msg.member.user.avatarURL( {format: 'jpg'} ))
      .setColor('RED')
      .addField('Member', `${msg.member.user.tag} (<@${msg.member.user.id}>)`, true)
      .addField('Priority', highestPrio, true)
      .addField('Message', msg.content)
      .setTimestamp()
      this.client.channels.cache.get(channelID).send(embed);
  }

  async init() {}
};
