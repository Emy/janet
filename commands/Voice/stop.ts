import { KlasaClient, CommandStore, KlasaMessage } from "klasa";

let { Command } = require('klasa');

module.exports = class extends Command {
  constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      enabled: false,
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS'],
      aliases: ['leave'],
      cooldown: 5,
      description: (lang) => lang.get('STOP_DESCRIPTION'),
    });
  }

  async run(msg: KlasaMessage, [...paran]) {
    // if (!msg.checkVoicePermission()) return;
    // const lang = msg.language;
    // const emojis = this.client.emojis.cache;
    // const dispatcher = this.client.queue.get(msg.guild.id);
    // dispatcher.onEvent();
    // msg.genEmbed()
    //     .setTitle(`${emojis.get(emoji.stop)} ${lang.get('STOP')}`)
    //     .setDescription(lang.get('STOPPING'))
    //     .send();

    return null;
  }
};
