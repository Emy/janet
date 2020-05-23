import { Command, CommandStore, KlasaMessage, TextPrompt, Usage, KlasaClient } from 'klasa';
import { IDevice, getDevices, getDevice } from 'ipswme';

export default class extends Command {
    constructor(store: CommandStore, file: string[], dir: string) {
        super(store, file, dir, {
            promptLimit: 2,
            promptTime: 30 * 1000,
            runIn: ['text'],
            requiredPermissions: ['MANAGE_NICKNAMES'],
            usage: '(device:device)',
        });

        this.createCustomResolver('device', async (arg: string) => {
            if (!arg) throw `Missing device`;
            const devices = await getDevices();

            const exists = devices.find(
                (x) =>
                    x.name
                        .replace(/\(.*\)$/, '')
                        .trim()
                        .toLowerCase() === arg.toLowerCase() ||
                    x.name
                        .replace(/\(.*\)$/, '')
                        .replace(' Plus', '+')
                        .trim()
                        .toLowerCase() === arg.toLowerCase(),
            );
            if (exists) return exists;
            throw `Device doesn't exist`;
        });
    }

    async run(msg: KlasaMessage, [device]: [IDevice]) {
        if (msg.member!.nickname && /^.+ \[.+\,.+\]$/.test(msg.member!.nickname!)) {
            return msg.reply('device already set') as Promise<KlasaMessage>;
        }

        const firmwares = await getDevice(device.identifier);

        const usage = new Usage(msg.client as KlasaClient, '(version:version)', ' ');
        usage.createCustomResolver('version', (arg: string) => {
            const exists = firmwares.firmwares!.some((x) => x.version === arg);
            if (exists) return arg;
            throw `Version doesn't exist`;
        });

        const prompt = new TextPrompt(msg, usage, { limit: 3 });

        const response = await prompt.run('Please enter version');

        const deviceName = device.name
            .replace(/\(.*\)$/, '')
            .replace(' Plus', '+')
            .replace('Pro Max', 'PM')
            .trim();
        const nickname = `${msg.member!.displayName} [${deviceName},${response[0]}]`;

        if (nickname.length > 32) return msg.reply('nickname too long') as Promise<KlasaMessage>;

        msg.member!.setNickname(nickname);

        return msg.reply(`nickname set to \`${nickname}\``) as Promise<KlasaMessage>;
    }
}
