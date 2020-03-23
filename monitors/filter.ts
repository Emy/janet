import { MessageEmbed, TextChannel } from 'discord.js';
import { KlasaClient, Monitor, MonitorStore, KlasaMessage } from 'klasa';

export default class extends Monitor {

  constructor(client: KlasaClient, store: MonitorStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      enabled: true,
      ignoreBots: false,
      ignoreSelf: true,
      ignoreOthers: false,
      ignoreWebhooks: true,
      ignoreEdits: false
    });
  }

  async run(msg: KlasaMessage) {
    if (!msg.guild.settings.get('filter.enableWordFiltering')) return;
    const filteredWords = [];
    let highestPrio = -1;
    msg.guild.settings.get('filter.words').forEach((filterWord) => {
      if (!(msg.content.toLowerCase().indexOf(filterWord.word.toLowerCase()) > -1)) return;
      filteredWords.push(filterWord.word);
      if (!(highestPrio < filterWord.priority)) return;
      highestPrio = filterWord.priority;
    });
    if (filteredWords.length === 0) return;
    const excludedChannels = msg.guild.settings.get('filter.excludedChannels');
    if (excludedChannels.some((excludedChannel) => msg.channel.id == excludedChannel)) return;

    await msg.delete();
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

  async init() {}
};
