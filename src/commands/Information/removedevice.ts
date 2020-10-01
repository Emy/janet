import { Command, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {
    constructor(store: CommandStore, file: string[], dir: string) {
        super(store, file, dir, {
            runIn: ['text'],
            requiredPermissions: ['MANAGE_NICKNAMES'],
        });
    }

    async run(msg: KlasaMessage) {
        if (!/^.+ \[.+\,.+\]$/.test(msg.member!.nickname!)) {
            return msg.reply('no device set') as Promise<KlasaMessage>;
        }

        const nickname = msg.member!.nickname!.replace(/ \[.+,.+\]/, '');

        if (nickname.length > 32) return msg.reply('nickname too long') as Promise<KlasaMessage>;

        msg.member!.setNickname(nickname);

        return msg.reply(`nickname set to \`${nickname}\``) as Promise<KlasaMessage>;
    }
}
