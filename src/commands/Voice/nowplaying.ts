import { Command, KlasaClient, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {
  constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      enabled: false,
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      aliases: ['np'],
      cooldown: 5,
      description: (lang) => lang.get('NOWPLAYING_DESCRIPTION'),
    });
  }

  async run(msg: KlasaMessage, [...params]) {
    // if (!msg.checkVoicePermission()) return;
    // const lang = msg.language;
    // const player = this.client.music.get(msg.guild.id);
    // const song = player.songs[0];
    // const emojis = this.client.emojis.cache;
    // msg.genEmbed()
    //     .setTitle(`${emojis.get(emoji.play)} ${lang.get('NOW_PLAYING')}`)
    //     .setDescription(Util.escapeMarkdown(song.info.title))
    //     .setThumbnail(`https://img.youtube.com/vi/${song.info.identifier}/default.jpg`)
    //     .addField(
    //         `${emojis.get(emoji.time)} ${lang.get('LENGTH')}`,
    //         msg.genHMDTime(song.info.length),
    //         true)
    //     .send();

    return null;
  }
};
