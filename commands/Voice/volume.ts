import { Command, KlasaClient, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {
  constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      enabled: false,
      runIn: ['text'],
      requiredPermissions: [],
      cooldown: 5,
      description: (lang) => lang.get('VOLUME_DESCRIPTION'),
      usage: '[volume:int]',
    });
  }

  async run(msg: KlasaMessage, [volume]) {
    if (!msg.checkVoicePermission()) return;
    const player = this.client.music.get(msg.guild.id);
    const emojis = this.client.emojis.cache;
    const lang = msg.language;
    if (!volume) {
      return msg.genEmbed()
          .setTitle(`${emojis.get(emoji.volume)} ${lang.get('VOLUME')}`)
          .setDescription(lang.get('CURRENT_VOLUME', player.state.volume))
          .send();
    }
    if (volume <= 0 || volume > 200) {
      return msg.sendError('VOLUME_RESTRICTION');
    }
    msg.genEmbed()
        .setTitle(`${emojis.get(emoji.volume)} ${lang.get('VOLUME')}`)
        .setDescription(lang.get('SETTING_VOLUME', volume))
        .send();
    player.volume(volume);
  }
};
