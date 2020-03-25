const { Duration, Monitor, RateLimit } = require('klasa');
const { Collection, MessageEmbed } = require('discord.js');
const ASCIIFolder = require('fold-to-ascii');

const Case = require('../util/case');

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

    this.ratelimits = new Collection();
  }

  async run(msg) {
    if (!msg.guild.settings.filter.enableWordFiltering) return;

    const content = ASCIIFolder.foldMaintaining(msg.content).toLowerCase();

    const filteredWords = [];
    let highestPrio = -1;
    msg.guild.settings.filter.words.forEach((filterWord) => {
      if (!(content.indexOf(filterWord.word.toLowerCase()) > -1)) return;
      filteredWords.push(filterWord.word);
      if (!(highestPrio < filterWord.priority)) return;
      highestPrio = filterWord.priority;
    });
    if (filteredWords.length === 0) return;
    const excludedChannels = msg.guild.settings.filter.excludedChannels;
    if (excludedChannels.some((excludedChannel) => msg.channel.id == excludedChannel)) return;

    await msg.delete();

    if (!this.ratelimits.has(msg.author.id)) {
      this.ratelimits.set(msg.author.id, new RateLimit(5, 10 * 1000));
    }

    const limiter = this.ratelimits.get(msg.author.id);

    if (limiter.limited && !msg.member.roles.cache.has(msg.guild.settings.roles.muted)) {
      
      await msg.member.roles.add(msg.guild.settings.roles.muted);
      await msg.member.user.settings.update('isMuted', true);

      const d = new Date();
      d.setMinutes(d.getMinutes() + 30);
      const c = await this.buildCase(msg, 'Filter Spam', msg.member.user, d);
      await this.client.schedule.create('unmute', d, {
          data: {
            guildID: msg.guild.id,
            memberID: msg.member.id
        },
        catchUp: true,
      });

      this.sendEmbed(msg, msg.member, 'Filter Spam', d, c)

    }

    if (!limiter.limited) {
      limiter.drip();
    }

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
      .addField('Channel', `<#${msg.channel.id}>`)
      .addField('Message', msg.content)
      .setTimestamp()
      this.client.channels.cache.get(channelID).send(embed);
  }

  async buildCase(msg, reason, user, duration) {
    const c = new Case({
      id: this.client.settings.caseID,
      type: 'MUTE',
      date: Date.now(),
      until: duration,
      modID: msg.author.id,
      modTag: msg.author.tag,
      reason: reason,
      punishment: duration ? Duration.toNow(duration) : 'PERMANENT',
      currentWarnPoints: user.settings.warnPoints
    });
    await this.client.settings.update('caseID', this.client.settings.caseID + 1);
    await user.settings.update('cases', c, { action: 'add' });
    return c;
  }

  sendEmbed(msg, member, reason, duration, c) {
    const channelID = msg.guild.settings.channels.public;
    if (!channelID) return 'logchannel';
    const embed = new MessageEmbed()
      .setTitle('Member Muted')
      .setThumbnail(member.user.avatarURL({format: 'jpg'}))
      .setColor('RED')
      .addField('Member', `${member.user.tag} (${member.user})`, true)
      .addField('Mod', `${msg.client.user.tag} (${msg.client.user})`, true)
      .addField('Duration', duration ? Duration.toNow(duration) : 'PERMANENT')
      .addField('Reason', reason ? reason : 'No reason.')
      .setFooter(`Case #${c.id} | ${member.id}`)
      .setTimestamp();
    return this.client.channels.cache.get(channelID).send(embed);
  }

  async init() {}
};
