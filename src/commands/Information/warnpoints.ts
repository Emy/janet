import { MessageEmbed } from 'discord.js';
import { Command, CommandStore, KlasaClient, KlasaMessage, KlasaUser } from 'klasa';

export default class extends Command {

  constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
      requiredSettings: [],
      guarded: false,
      permissionLevel: 5,
      description: 'Views total warnpoints of member.',
      extendedHelp: '!warnpoints [optional: <usertag | userid>]',
      usage: '[user:user]',
    });
  }

  async run(msg: KlasaMessage, [user]: [KlasaUser]) {
    if (!user) user = msg.author
    
    const embed = new MessageEmbed()
      .setTitle('Warn Points')
      .setColor('ORANGE')
      .setThumbnail(user.avatarURL({ format: 'jpg' }))
      .addField('Member', `${user.tag} (<@${user.id}>)`)
      .addField('Warn Points', user.settings.get('warnPoints'))
      .setFooter(user.id)
      .setTimestamp();

    msg.delete();
    return msg.send(embed);
  }

  async init() {}

};
