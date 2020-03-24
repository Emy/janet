import { MessageEmbed, TextChannel, Collection, GuildMember } from 'discord.js';
import { KlasaClient, MonitorStore, KlasaMessage, Duration, Monitor, RateLimit, KlasaUser } from 'klasa';
import ASCIIFolder from 'fold-to-ascii'

import Case from "../util/case"

export default class extends Monitor {
  ratelimits: Collection<string, RateLimit>

  constructor(client: KlasaClient, store: MonitorStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      enabled: true,
      ignoreBots: false,
      ignoreSelf: true,
      ignoreOthers: false,
      ignoreWebhooks: true,
      ignoreEdits: false
    });

    this.ratelimits = new Collection();
  }

  async run(msg: KlasaMessage) {
    if (!msg.guild.settings.get('filter.enableWordFiltering')) return;

    const content = ASCIIFolder.foldMaintaining(msg.content).toLowerCase();

    const filteredWords = [];
    let highestPrio = -1;
    msg.guild.settings.get('filter.words').forEach((filterWord) => {
     if (!(content.indexOf(filterWord.word.toLowerCase()) > -1)) return;
      filteredWords.push(filterWord.word);
      if (!(highestPrio < filterWord.priority)) return;
      highestPrio = filterWord.priority;
    });
    if (filteredWords.length === 0) return;
    const excludedChannels = msg.guild.settings.get('filter.excludedChannels');
    if (excludedChannels.some((excludedChannel) => msg.channel.id == excludedChannel)) return;

    await msg.delete();

    if (!this.ratelimits.has(msg.author.id)) {
      this.ratelimits.set(msg.author.id, new RateLimit(5, 10 * 1000));
    }

    const limiter = this.ratelimits.get(msg.author.id);

    if (limiter.limited && !msg.member.roles.cache.has(msg.guild.settings.get('roles.muted'))) {
      
      await msg.member.roles.add(msg.guild.settings.get('roles.muted'));
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
    msg.guild.roles.cache.get(msg.guild.settings.get('roles.moderator')).members.map((member) => {
      if (!(member.presence.status === 'online' || member.presence.status === 'idle' || member.user.settings.get('offlineReportPing'))) return;
      membersToPing.push(member);
    });

    const channelID = msg.guild.settings.get('channels.reports');
    if (membersToPing.length > 0) {
      let content = '';
      membersToPing.forEach((member) => {
        content+= `<@${member.user.id}> `;
      })
      
      const channel = this.client.channels.cache.get(channelID) as TextChannel
      channel.send(content);
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
      const channel = this.client.channels.cache.get(channelID) as TextChannel
      channel.send(embed);
  }

  async buildCase(msg: KlasaMessage, reason: string, user: KlasaUser, duration: Date) {
    const c = new Case({
      id: this.client.settings.get('caseID'),
      type: 'MUTE',
      date: Date.now(),
      until: duration,
      modID: msg.author.id,
      modTag: msg.author.tag,
      reason: reason,
      punishment: duration ? Duration.toNow(duration) : 'PERMANENT',
      currentWarnPoints: user.settings.get('warnPoints')
    });
    await this.client.settings.update('caseID', this.client.settings.get('caseID') + 1);
    await user.settings.update('cases', c, { action: 'add' });
    return c;
  }

  sendEmbed(msg: KlasaMessage, member: GuildMember, reason: string, duration: Date, c: Case) {
    const channelID = msg.guild.settings.get('channels.public');
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

    const channel = this.client.channels.cache.get(channelID) as TextChannel
    return channel.send(embed);
  }

  async init() {}
};
