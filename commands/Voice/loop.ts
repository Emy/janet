import { Command, KlasaClient, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {
  constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      enabled: false,
      runIn: ['text'],
      requiredPermissions: [],
      aliases: ['l'],
      cooldown: 5,
      description: (lang) => lang.get('LOOP_DESCRIPTION'),
    });
  }

  async run(msg: KlasaMessage, [...params]) {
    // if (!msg.checkVoicePermission()) return;
    // const player = this.client.music.get(msg.guild.id);
    // player.loop = !player.loop;
    // const title = player.loop ? 'LOOPED' : 'UNLOOPED';
    // const desc = player.loop ? 'LOOPED_DESCRIPTION' : 'UNLOOPED_DESCRIPTION';

    // msg.sendEmbed(new MessageEmbed()
    //     .setTitle(msg.language.get(title))
    //     .setDescription(msg.language.get(desc)))

    return null;
  }
};
