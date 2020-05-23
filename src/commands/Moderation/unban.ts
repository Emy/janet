import { MessageEmbed, TextChannel } from 'discord.js';
import { Command, CommandStore, KlasaMessage, KlasaUser } from 'klasa';
import Case from '../../util/case';

export default class extends Command {
    constructor(store: CommandStore, file: string[], dir: string) {
        super(store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: ['BAN_MEMBERS'],
            aliases: [],
            guarded: true,
            permissionLevel: 7,
            description: 'Unbans a member. (Server Owner and Bot Owner only)',
            extendedHelp: '!unban <userid> [optional: reason]',
            usage: '<user:user> [reason:...string]',
            usageDelim: ' ',
        });
    }

    async run(msg: KlasaMessage, [user, reason]: [KlasaUser, string]) {
        const bannedPlayers = await msg.guild.fetchBans();
        if (!bannedPlayers.has(user.id)) return msg.send('Target is not banned.');
        await msg.guild.members.unban(user, reason);
        if (user.settings.get('warnPoints') >= 600) user.settings.update('warnPoints', 450);

        const c = await this.buildCase(msg, reason, user);

        this.sendEmbed(msg, user, reason, c);
    }

    async buildCase(msg: KlasaMessage, reason: string, user: KlasaUser) {
        const c = new Case({
            id: this.client.settings.get('caseID') as number,
            type: 'UNBAN',
            date: Date.now(),
            until: undefined,
            modID: msg.author.id,
            modTag: msg.author.tag,
            reason: reason,
            punishment: undefined,
            currentWarnPoints: user.settings.get('warnPoints') as number,
        });
        await this.client.settings.update('caseID', (this.client.settings.get('caseID') as number) + 1);
        await user.settings.update('cases', c, { arrayAction: 'add' });
        return c;
    }

    sendEmbed(msg: KlasaMessage, user: KlasaUser, reason: string, c: Case) {
        const channelID = msg.guild.settings.get('channels.public');
        if (!channelID) return 'logchannel';
        const embed = new MessageEmbed()
            .setTitle('Member Unbanned')
            .setThumbnail(user.avatarURL({ format: 'jpg' }))
            .setColor('GREEN')
            .addField('Member', `${user.tag} (<@${user.id}>)`, true)
            .addField('Mod', `${msg.author.tag} (<@${msg.author.id}>)`, true)
            .addField('Reason', reason ? reason : 'No reason.')
            .setFooter(`Case #${c.id} | ${user.id}`)
            .setTimestamp();

        const channel = this.client.channels.get(channelID as string) as TextChannel;
        channel.send(embed);
    }
}
