import { TextChannel } from 'discord.js';
import { Command, CommandStore, KlasaClient, KlasaMessage } from 'klasa';

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            runIn: ['text'],
            permissionLevel: 6,
            description: 'Says a message in a specified channel',
            usage: '<channel:channel> <message:...string>',
            usageDelim: ' ',
        });
    }

    async run(msg: KlasaMessage, [channel, message]: [TextChannel, string]) {
        msg.delete();
        channel.send(message);

        return null;
    }
}
