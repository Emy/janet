import { Command, CommandStore, KlasaClient, KlasaMessage, RichDisplay } from 'klasa';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

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
            requiredPermissions: ['SEND_MESSAGES'],
            requiredSettings: [],
            aliases: ['list'],
            guarded: false,
            permissionLevel: 0,
            description: 'Lists devices available for !adddevice.',
        });
    }

    async run(msg: KlasaMessage) {
        const devices: APIDevice[] = await fetch('https://api.ipsw.me/v4/devices').then((r) => r.json());
        const iPhonesEmbed1 = new MessageEmbed({
            fields: devices
                .filter((device) => device.name.startsWith('iPhone'))
                .slice(0, 24)
                .map((device) => {
                    return {
                        name: device.name,
                        value: device.identifier,
                    };
                }),
        })
            .setTimestamp()
            .setTitle('iPhones [1/2]')
            .setColor('GREEN');
        const iPhonesEmbed2 = new MessageEmbed({
            fields: devices
                .filter((device) => device.name.startsWith('iPhone'))
                .slice(24)
                .map((device) => {
                    return {
                        name: device.name,
                        value: device.identifier,
                    };
                }),
        })
            .setTimestamp()
            .setTitle('iPhones [2/2]')
            .setColor('GREEN');
        const iPadsEmbed1 = new MessageEmbed({
            fields: devices
                .filter((device) => device.name.startsWith('iPad'))
                .slice(0, 24)
                .map((device) => {
                    return {
                        name: device.name,
                        value: device.identifier,
                    };
                }),
        })
            .setTimestamp()
            .setTitle('iPads [1/3]')
            .setColor('GREEN');
        const iPadsEmbed2 = new MessageEmbed({
            fields: devices
                .filter((device) => device.name.startsWith('iPad'))
                .slice(24, 48)
                .map((device) => {
                    return {
                        name: device.name,
                        value: device.identifier,
                    };
                }),
        })
            .setTimestamp()
            .setTitle('iPads [2/3]')
            .setColor('GREEN');
        const iPadsEmbed3 = new MessageEmbed({
            fields: devices
                .filter((device) => device.name.startsWith('iPad'))
                .slice(48)
                .map((device) => {
                    return {
                        name: device.name,
                        value: device.identifier,
                    };
                }),
        })
            .setTimestamp()
            .setTitle('iPads [3/3]')
            .setColor('GREEN');
        const aTVsEmbed = new MessageEmbed({
            fields: devices
                .filter((device) => device.name.startsWith('Apple TV'))
                .slice(0, 24)
                .map((device) => {
                    return {
                        name: device.name,
                        value: device.identifier,
                    };
                }),
        })
            .setTimestamp()
            .setTitle('Apple TVs')
            .setColor('GREEN');
        const watchesEmbed = new MessageEmbed({
            fields: devices
                .filter((device) => device.name.startsWith('Apple Watch'))
                .slice(0, 24)
                .map((device) => {
                    return {
                        name: device.name,
                        value: device.identifier,
                    };
                }),
        })
            .setTimestamp()
            .setTitle('Apple Watches')
            .setColor('GREEN');
        const otherEmbed = new MessageEmbed({
            fields: devices
                .filter(
                    (device) =>
                        !device.name.startsWith('iPhone') &&
                        !device.name.startsWith('iPad') &&
                        !device.name.startsWith('Apple TV') &&
                        !device.name.startsWith('Apple Watch'),
                )
                .slice(0, 24)
                .map((device) => {
                    return {
                        name: device.name,
                        value: device.identifier,
                    };
                }),
        })
            .setTimestamp()
            .setTitle('Other')
            .setColor('GREEN');
        const embed = new RichDisplay()
            .setFooterSuffix('Provided by: ipsw.me')
            .addPage(iPhonesEmbed1)
            .addPage(iPhonesEmbed2)
            .addPage(iPadsEmbed1)
            .addPage(iPadsEmbed2)
            .addPage(iPadsEmbed3)
            .addPage(aTVsEmbed)
            .addPage(watchesEmbed)
            .addPage(otherEmbed);
        embed.run(msg, { firstLast: false, jump: false, time: 120000 });
        return null;
    }
}
