import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Command, CommandStore, KlasaClient, KlasaMessage, KlasaUser } from 'klasa';

import Case from '../../util/case';

export default class extends Command {

  constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
    super(client, store, file, dir, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: ['KICK_MEMBERS'],
      guarded: true,
      permissionLevel: 5,
      description: 'Kicks a member from the server.',
      extendedHelp: '<usertag | userid> [optional: reason]',
      usage: '<member:member> [reason:...string]',
      usageDelim: ' ',
    });
  }

  async run(msg: KlasaMessage, [member, reason]) {
    if (member.id === this.client.user.id) return msg.send('I cannot kick myself.');
    if (member.id === msg.author.id) return msg.send('You cannot kick yourself.');
    if (member.roles.highest.position >= msg.member.roles.highest.position) return msg.send('Your highest role is even or lower than the target users role.');
    if (!member.kickable) return msg.send('The target is not kickable.');
    await member.kick(reason);
    const c = await this.buildCase(msg, reason, member.user);
    this.sendEmbed(msg, member, reason, c);
    msg.delete();
  }

  async init() {}

  async buildCase(msg: KlasaMessage, reason: string, user: KlasaUser) {
    const c = new Case({
      id: this.client.settings.get('caseID'),
      type: 'KICK',
      date: Date.now(),
      until: undefined,
      modID: msg.author.id,
      modTag: msg.author.tag,
      reason: reason,
      punishment: undefined,
      currentWarnPoints: user.settings.get('warnPoints')
    });
    await this.client.settings.update('caseID', this.client.settings.get('caseID') + 1);
    await user.settings.update('cases', c, { action: 'add' });
    return c;
  }

  sendEmbed(msg: KlasaMessage, member: GuildMember, reason: string, c: Case) {
    const channelID = msg.guild.settings.get('channels.public');
    if (!channelID) return 'logchannel';
    const embed = new MessageEmbed()
      .setTitle('Member Kicked')
      .setThumbnail(member.user.avatarURL({format: 'jpg'}))
      .setColor('RED')
      .addField('Member', `${member.user.tag} (<@${member.id}>)`, true)
      .addField('Mod', `${msg.author.tag} (<@${msg.author.id}>)`, true)
      .addField('Reason', reason ? reason : 'No reason.')
      .setFooter(`Case #${c.id} | ${member.id}`)
      .setTimestamp();

    const channel = this.client.channels.cache.get(channelID) as TextChannel
    channel.send(embed);
  }
};
