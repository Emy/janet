import { Message, MessageEmbed } from 'discord.js';
import { Extendable } from 'klasa';

export default class extends Extendable {
    constructor(...args) {
        super(...args, {
            enabled: true,
            appliesTo: [Message],
        });
    }

    genEmbed() {
        const embed = new MessageEmbed();
        embed.msg = this;
        embed.lang = this.language;
        const requestedBy = this.language.get('FOOTER_REQUESTED_BY');
        embed
            .setFooter(`${requestedBy} ${this.author.tag}`, this.author.avatarURL({ format: 'jpg' }))
            .setTimestamp()
            .setColor('#a8e6cf');
        return embed;
    }

    // colorscheme: #a8e6cf • #dcedc1 • #ffd3b6 • #ffaaa5 • #ff8b94

    sendError(reason, ...params) {
        const emojis = this.client.emojis.cache;
        const language = this.language;
        this.genEmbed()
            .setTitle(`${emojis.get(emoji.error)} ${language.get('ERROR')}`)
            .setDescription(language.get(reason, ...params))
            .setColor('#ff8b94')
            .send();
    }

    checkVoicePermission() {
        const dispatcher = this.client.queue.get(this.guild.id);
        if (!dispatcher) {
            this.sendError('NO_MUSIC_RUNNING');
            return false;
        }
        const memberChannel = this.member.voice.channel;
        if (!memberChannel) {
            this.sendError('NOT_IN_VC');
            return false;
        }
        if (!(memberChannel.id === dispatcher.player.voiceConnection.voiceChannelID)) {
            this.sendError('NOT_SAME_CHANNEL');
            return false;
        }
        return true;
    }

    genHMDTime(millis) {
        let totalSeconds = millis / 1000;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${hours != 0 ? `${hours}:` : ''}${minutes}:${seconds}`;
    }
}
