import { Command, CommandStore, KlasaClient, KlasaMessage } from 'klasa';

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: ['SEND_MESSAGES', 'MANAGE_NICKNAMES'],
            requiredSettings: [],
            aliases: ['remove'],
            guarded: false,
            permissionLevel: 0,
            description: 'Removes a device from your nickname.',
        });
    }

    async run(msg: KlasaMessage) {
        const nickname = msg.member.displayName;
        if (!/.+ \[.+, \d+\.\d+(\.\d+)?]/g.test(nickname)) return msg.send("You don't have a device in your nickname!");
        const nicknameChars = nickname.split('');
        const openIndex = nicknameChars.lastIndexOf('[');
        const newNickname = nickname.slice(0, openIndex - 1);
        msg.member.setNickname(newNickname).then(
            () => {
                msg.send('Removed a device from your nickname.');
            },
            () => {
                // error callback
                msg.send('There was an error setting your nickname!');
            },
        );
        return null;
    }
}
