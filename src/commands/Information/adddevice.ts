import { Command, CommandStore, KlasaClient, KlasaMessage } from 'klasa';
import fetch from 'node-fetch';
import { Message, MessageCollector, TextChannel } from 'discord.js';

interface APIFirmware {
    identifier: string;
    version: string;
    buildid: string;
    sha1sum: string;
    md5sum: string;
    filesize: string;
    url: string;
    releasedate: string;
    uploaddate: string;
    signed: boolean;
}

interface APIDevice {
    name: string;
    identifier: string;
    boardconfig: string;
    platform: string;
    cpid: number;
    bdid: number;
}

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            runIn: ['text'],
            requiredPermissions: ['SEND_MESSAGES', 'MANAGE_NICKNAMES'],
            requiredSettings: [],
            aliases: ['add'],
            guarded: false,
            permissionLevel: 0,
            description: 'Adds a device to your nickname.',
        });
    }

    async run(msg: KlasaMessage) {
        const nickname = msg.member.displayName;
        if (/.+ \[.+, \d+\.\d+(\.\d+)?]/g.test(nickname))
            return msg.send('Sorry, but your nickname already has a device. Use `!removedevice` to remove it.');
        const devices: APIDevice[] = await fetch('https://api.ipsw.me/v4/devices').then((r) => r.json());
        const deviceCollector = new MessageCollector(msg.channel as TextChannel, (m) => m.author.id === msg.author.id, {
            max: 1,
        });
        await msg.send('What device are you using?\nEg. iPhone 11, iPhone 8 (GSM)');
        deviceCollector.on('collect', async (deviceMessage: Message) => {
            const device = devices.find((d) => d.name.toLowerCase() === deviceMessage.content.toLowerCase());
            if (!device) return msg.channel.send("Sorry, but that's not a valid device. Not sure? Try `!listdevices`.");
            const loadingMessage = await msg.channel.send('Loading OS versions...');
            const firmwares: APIFirmware[] = (
                await fetch('https://api.ipsw.me/v4/device/' + device.identifier + '?type=ipsw').then((r) => r.json())
            )['firmwares'];
            await loadingMessage.edit('What OS version are you on?\nEg. 13.3, 12.4');
            console.log(firmwares);
            const firmwareCollector = new MessageCollector(
                msg.channel as TextChannel,
                (m) => m.author.id === msg.author.id,
                {
                    max: 1,
                },
            );
            firmwareCollector.on('collect', async (firmwareMessage: Message) => {
                const firmware = firmwares.find((f) => f.version === firmwareMessage.content);
                if (!firmware)
                    return msg.channel.send("Sorry, that's not a valid OS version for this device. Try again.");
                const finalString = ` [${device.name}, ${firmware.version}]`;
                msg.member.setNickname(msg.member.displayName + finalString).then(
                    () => {
                        msg.channel.send('Success! Added' + finalString + ' to your nickname.');
                    },
                    () => {
                        // error callback
                        msg.channel.send("Oops! I don't have permissions to change your nickname.");
                    },
                );
            });
        });
        return null;
    }
}
