import { Event, KlasaClient, EventStore, KlasaMessage } from 'klasa';
import { MessageEmbed, TextChannel } from 'discord.js';

export default class extends Event {

  constructor(client: KlasaClient, store: EventStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      enabled: true
    });
  }

  async run(oldMsg: KlasaMessage, newMsg: KlasaMessage) {
    if (oldMsg.author.bot) return;
    if (!newMsg.content || !oldMsg.content) return;
    if (oldMsg.content === newMsg.content) return;
    const channelID = oldMsg.guild.settings.get('channels.private');
    if (!channelID) return;
    for(let channel of oldMsg.guild.settings.get('logging.excludedChannels')) {
      if (oldMsg.channel.id === channel) return;
    }
    const embed = new MessageEmbed()
      .setTitle('Message Updated')
      .setThumbnail(oldMsg.author.avatarURL({format: 'jpg'}))
      .setColor('BLUE')
      .addField('User', `${oldMsg.author.tag} (<@${oldMsg.author.id}>)`)
      .addField('Old Message', oldMsg.content)
      .addField('New Message', newMsg.content)
      .addField('Channel', `<#${oldMsg.channel.id}>`)
      .setTimestamp();

      const channel = this.client.channels.cache.get(channelID) as TextChannel
      channel.send(embed);
  }

  async init() {}
};
