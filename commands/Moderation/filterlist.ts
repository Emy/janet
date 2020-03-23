import { Command, CommandStore, KlasaClient, KlasaMessage } from 'klasa';

import FilteredWord from '../../util/filteredWord';

export default class extends Command {
  constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      enabled: true,
      runIn: ['text', 'dm', 'group'],
      requiredPermissions: [],
      requiredSettings: [],
      aliases: [],
      autoAliases: true,
      bucket: 1,
      cooldown: 0,
      promptLimit: 0,
      promptTime: 30000,
      deletable: false,
      guarded: false,
      nsfw: false,
      permissionLevel: 4,
      description: 'Views the list of filtered words.',
      extendedHelp: '[optional: <0 | 1>] 0 = Silent Delete, 1 = Reported',
      usage: '[prio:integer]',
      usageDelim: undefined,
      quotedStringSupport: false,
      subcommands: false
    });
  }

  async run(msg: KlasaMessage, [prio] : [number]) {
    let content = 'Filterwords: '
    msg.guild.settings.filter.words.forEach((fw: FilteredWord) => {
      if (prio === undefined) content = content + `${fw.word} (${fw.priority}), `;
      if (prio === fw.priority) content = content + `${fw.word} (${fw.priority}), `;
    });

    return msg.send(content);
  }

  async init() {}

};
