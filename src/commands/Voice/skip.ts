import { Command, CommandStore, KlasaClient, KlasaMessage } from 'klasa';

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: false,
            runIn: ['text'],
            requiredPermissions: ['EMBED_LINKS'],
            cooldown: 5,
            description: (lang) => lang.get('SKIP_DESCRIPTION'),
        });
    }

    async run(msg: KlasaMessage, [...paran]) {
        // if (!msg.checkVoicePermission()) return;
        // const lang = msg.language;
        // const player = this.client.music.get(msg.guild.id);
        // msg.genEmbed()
        //     .setTitle(lang.get('SKIP'))
        //     .setDescription(lang.get('SKIPPING_TRACK'))
        //     .send();
        // player.stop();

        return null;
    }
}
