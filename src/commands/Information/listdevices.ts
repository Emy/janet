import { Command, KlasaMessage, RichDisplay } from 'klasa';
import { MessageEmbed } from 'discord.js';
import { getDevices, IDevice } from 'ipswme';

interface CategorizedDevices {
    iPhone: IDevice[];
    iPod: IDevice[];
    iPad: IDevice[];
    AppleTV: IDevice[];
    AppleWatch: IDevice[];
    HomePod: IDevice[];
}

type DeviceCategory = 'iPhone' | 'iPod' | 'iPad' | 'AppleTV' | 'AppleWatch' | 'HomePod';

const chunkSize = 20;

export default class extends Command {
    // constructor? What constructor?
    description = 'List devices';
    aliases = ['list'];

    async run(msg: KlasaMessage) {
        const waitMsg = await msg.reply('Please wait...');
        const display = new RichDisplay();
        display.setFooterSuffix(` - Requested by ${msg.author.tag}`);

        const allDevices = await getDevices();

        // Splits devices into each device category
        const categorized = this.categorize(allDevices);

        for (const category in categorized) {
            // chunk shit up
            const chunks = chunk(categorized[category as DeviceCategory], chunkSize);

            for (const i in chunks) {
                const embed = new MessageEmbed().setTimestamp();

                // Doing the same shit as the crappy one but not statically
                // Had to cast the index to number as it's interpreted as a string lmfao
                embed.setTitle(`${category} [${Number(i) + 1}/${chunks.length}]`);

                chunks[i].forEach((x) => embed.addField(x.name, x.identifier));

                display.addPage(embed);
            }
        }

        display.run(waitMsg as KlasaMessage);

        return null;
    }

    // pardon the crappy code
    private categorize(devices: IDevice[]): CategorizedDevices {
        return devices.reduce((prev: any, val) => {
            if (val.name.startsWith('iPhone')) {
                if (!prev.iPhone) prev.iPhone = [];
                prev.iPhone.push(val);
            } else if (val.name.startsWith('iPod')) {
                if (!prev.iPod) prev.iPod = [];
                prev.iPod.push(val);
            } else if (val.name.startsWith('iPad')) {
                if (!prev.iPad) prev.iPad = [];
                prev.iPad.push(val);
            } else if (val.name.startsWith('Apple TV')) {
                if (!prev.AppleTV) prev.AppleTV = [];
                prev.AppleTV.push(val);
            } else if (val.name.startsWith('Apple Watch')) {
                if (!prev.AppleWatch) prev.AppleWatch = [];
                prev.AppleWatch.push(val);
            } else if (val.name.startsWith('HomePod')) {
                if (!prev.HomePod) prev.HomePod = [];
                prev.HomePod.push(val);
            }

            return prev;
        }, {});
    }
}

function chunk<T>(arr: T[], len: number): T[][] {
    const chunks = [];
    for (let i = 0; i < arr.length; i += len) {
        chunks.push(arr.slice(i, i + len));
    }
    return chunks;
}
