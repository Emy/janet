import { MessageEmbed } from 'discord.js';
import { Command, CommandStore, KlasaMessage, RichDisplay } from 'klasa';
import JanetClient from '../../lib/client';
import Dispatcher from '../../util/dispatcher';

export default class extends Command {
    client: JanetClient;
    constructor(client: JanetClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: ['EMBED_LINKS'],
            aliases: ['q'],
            cooldown: 5,
            description: (lang) => lang.get('QUEUE_DESCRIPTION'),
        });
    }

    async run(msg: KlasaMessage) {
        if (!(await msg.hasAtLeastPermissionLevel(5))) {
            if (!msg.guild.settings.get('channels.botspam')) return;
            if (msg.channel.id != msg.guild.settings.get('channels.botspam')) {
                return msg.send(`Command only allowed in <#${msg.guild.settings.get('channels.botspam')}>`);
            }
        }
        const dispatcher = this.client.queue.get(msg.guild.id) as Dispatcher;
        if (!dispatcher) return msg.send('No music playing in here.');
        if (msg.member.voice.channel.id != dispatcher.player.voiceConnection.voiceChannelID) {
            return msg.send('We need to be in the same voice channel.');
        }
        const display = new RichDisplay();
        let embed = this.generateQueueEmbed();
        if (dispatcher.queue.length === 0) return this.sendEmptyQueueEmbed(msg);
        let counter = 0;
        for (const song of dispatcher.queue) {
            embed.addField(`**#${counter}** ${song.info.title}`, song.info.author);
            counter++;
            if (counter % 10 === 0) {
                display.addPage(embed);
                embed = this.generateQueueEmbed();
            }
        }
        if (counter % 10 !== 0) display.addPage(embed);
        display.run(msg, {
            jump: false,
            stop: false,
            firstLast: false,
            time: 30000,
        });
        return null;
    }

    async sendEmptyQueueEmbed(msg: KlasaMessage): Promise<KlasaMessage> {
        const embed = new MessageEmbed()
            .setTitle('Queue')
            .setColor('GREEN')
            .setTimestamp()
            .setDescription('The Queue is empty!');
        return (await msg.send(embed)) as KlasaMessage;
    }

    generateQueueEmbed(): MessageEmbed {
        const embed = new MessageEmbed().setTitle('Queue').setColor('GREEN').setTimestamp();
        return embed;
    }
}
