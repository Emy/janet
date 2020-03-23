import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Event, EventStore, KlasaClient } from 'klasa';

export default class extends Event {

  constructor(client: KlasaClient, store: EventStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      enabled: true,
      once: false
    });
  }

  async run(oldMember: GuildMember, newMember: GuildMember) {
    if (!(oldMember || newMember)) return;
    if (oldMember.nickname != newMember.nickname) {
      const channelID = oldMember.guild.settings.get('channels.private');
      if (!channelID) return;

      if (oldMember.guild.settings.get('filter.enableWordFiltering')) {
        for (let filteredWord of oldMember.guild.settings.get('filter.words')) {
          if (!newMember.nickname) continue;
          if (!newMember.nickname.toLowerCase().includes(filteredWord.word.toLowerCase())) continue;
          newMember.setNickname('change name pls', 'filtered word');
        }
      }

      const embed = new MessageEmbed()
        .setTitle('Member Renamed')
        .setThumbnail(oldMember.user.avatarURL({ format: 'jpg' }))
        .setColor('ORANGE')
        .addField('Member', `${oldMember.user.tag} (<@${oldMember.id}>)`)
        .addField('Old Nickname', oldMember.nickname ? oldMember.nickname : 'No Nickname', true)
        .addField('New Nickname', newMember.nickname ? newMember.nickname : 'No Nickname', true)
        .setFooter(oldMember.user.id)
        .setTimestamp();
        
        const channel = this.client.channels.cache.get(channelID) as TextChannel
        channel.send(embed);
    }
  }

  async init() {}

};
