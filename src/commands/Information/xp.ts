import { MessageEmbed } from 'discord.js';
import { Command, CommandStore, KlasaClient, KlasaMessage, KlasaUser } from 'klasa';

export default class extends Command {

  constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
      requiredSettings: [],
      aliases: ['xpstats'],
      guarded: false,
      permissionLevel: 0,
      description: 'Views xp of self or member.',
      extendedHelp: '!xp [optional: <usertag | userid>',
      usage: '[user:user]',
    });
  }

  async run(msg: KlasaMessage, [user]: [KlasaUser]) {
    if (!await msg.hasAtLeastPermissionLevel(5)) {
      if (!msg.guild.settings.get('channels.botspam')) return;
      if(msg.channel.id != msg.guild.settings.get('channels.botspam')) {
        return msg.send(`Command only allowed in <#${msg.guild.settings.get('channels.botspam')}>`);
      }
    }
    if (!user) user = msg.author;

    const leaderboard = this.client.users.cache.sort((a,b) => {
      if (a.settings.get('xp') > b.settings.get('xp')) return -1;
      if (a.settings.get('xp') < b.settings.get('xp')) return 1;
      return 0;
    }).array();

    let rank = 0;
    leaderboard.some((u) => {
      rank++;
      return u.id === user.id;
    });

    const embed = new MessageEmbed()
      .setTitle('Level Statistics')
      .setColor('GREEN')
      .setThumbnail(user.avatarURL({ format: 'jpg' }))
      .addField('Member', `${user.tag} (<@${user.id}>)`)
      .addField('Level', user.settings.get('level'), true)
      .addField('XP', `${user.settings.get('xp')}/${this.getRemainingXPForNextLevel(user.settings.get('level') + 1)}`, true)
      .addField('Rank', `${rank} / ${leaderboard.length}`, true)
      .setFooter(user.id)
      .setTimestamp();

      msg.delete();
      return msg.send(embed);
  }

  getRemainingXPForNextLevel(levelToReach: number){
    let level = 0
    let xp = 0;
    
    for (let e = 0; e < levelToReach; e++){
        xp = xp + 45 * level * (Math.floor(level / 10) + 1)
        level++
    }
    
    return xp;
}

  async init() {}

};
