import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Event, EventStore, KlasaClient } from 'klasa';
import ASCIIFolder from 'fold-to-ascii'

export default class extends Event {

  constructor(client: KlasaClient, store: EventStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      enabled: true,
      once: false
    });
  }

  async run(member: GuildMember) {
    if (member.guild.settings.get('filter.enableWordFiltering')) {

      const nick = ASCIIFolder.foldMaintaining(member.displayName).toLowerCase();

      for (let filteredWord of member.guild.settings.get('filter.words')) {
        if (!nick.includes(filteredWord.word.toLowerCase())) continue;
        member.setNickname('change name pls', 'filtered word');
      }
    }

    if (member.guild.settings.get('roles.member')) {
      member.roles.add(member.guild.settings.get('roles.member'));
    }

    let channelID = member.guild.settings.get('channels.private')
    if (!channelID) return;

    const embed = new MessageEmbed()
    .setTitle('Member Joined')
    .setThumbnail(member.user.avatarURL({format: 'jpg'}))
    .setColor('GREEN')
    .addField('User', `${member.user.tag} (<@${member.user.id}>)`, true)
    .addField('Warnpoints', member.user.settings.get('warnPoints'), true)
    .addField('Joined', member.joinedAt)
    .addField('Created', member.user.createdAt)
    .setTimestamp()
    .setFooter(member.user.id);
    let channel = this.client.channels.cache.get(channelID) as TextChannel
    channel.send(embed);
    
    channelID = member.guild.settings.get('channels.reports')
    if (!channelID) return;
    if (member.user.settings.get('isMuted')) {
      await member.roles.add(member.guild.settings.get('roles.muted'));
      embed.setTitle('Mute Evasion')
      .setColor('RED')
      
      channel.send(embed);
    }
  }

  async init() {}

};
