import { Command, CommandStore, KlasaMessage, RichDisplay } from 'klasa';
import JanetClient from '../../lib/client';
import Dispatcher from '../../util/dispatcher';

export default class extends Command {
    client: JanetClient;
    constructor(client: JanetClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: false,
            runIn: ['text'],
            requiredPermissions: ['EMBED_LINKS'],
            aliases: ['q'],
            cooldown: 5,
            description: (lang) => lang.get('QUEUE_DESCRIPTION'),
        });
    }

    async run(msg: KlasaMessage) {
        if (!this.client.queue.get(msg.guild.id)) return msg.send('No music playing in here.');
        const dispatcher = this.client.queue.get(msg.guild.id) as Dispatcher;
        if (!dispatcher) return msg.send('I could not loop/unloop');
        const display = new RichDisplay();
        // if (!msg.checkVoicePermission()) return;
        // const lang = msg.language;
        // const dispatcher = this.client.queue.get(msg.guild.id);
        // // Create the rich display
        // const display = new RichDisplay();

        // let embed = msg.genEmbed().setTitle(lang.get('QUEUE'));

        // // Add all songs to RichDisplay
        // for (let i = 0; i < dispatcher.queue.length; i++) {
        //   embed.addField(
        //       dispatcher.queue[i].info.title,
        //       msg.genHMDTime(dispatcher.queue[i].info.length),
        //   );

        //   // Split content into pages by creating a new every 10 entries, unless its 0.
        //   if (!(i % 9) && i !== 0) {
        //     display.addPage(embed);
        //     embed = msg.genEmbed().setTitle(lang.get('QUEUE'));
        //   }
        // }

        // // Add current page unless it is a multiple of 10 (in which case it would have already been added)
        // if (dispatcher.queue.length % 10) display.addPage(embed);

        // // Send the RichDisplay with 30 seconds timeout
        // return display.run(msg, {
        //   'jump': false,
        //   'stop': false,
        //   'firstLast': false,
        //   'time': 30000,
        // });

        return null;
    }
}
