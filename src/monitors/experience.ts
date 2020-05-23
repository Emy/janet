import { KlasaMessage, Monitor, MonitorStore } from 'klasa';

export default class extends Monitor {
    constructor(store: MonitorStore, file: string[], dir: string) {
        super(store, file, dir, {
            enabled: true,
            ignoreBots: true,
            ignoreSelf: true,
            ignoreOthers: false,
            ignoreWebhooks: true,
            ignoreEdits: true,
        });
    }

    async run(message: KlasaMessage) {
        if (!message.guild) return;
        if (message.author.settings.get('xpFrozen')) return;
        const gainedXP = Math.floor(Math.random() * 10 + 1);
        //if (message.member.lastMessage.content === message.content) gainedXP = gainedXP * -1;
        const currentXP = message.author.settings.get('xp') as number;
        await message.author.settings.update('xp', currentXP + gainedXP);
        await message.author.settings.update('level', this.getLevel(currentXP + gainedXP));

        if (message.author.settings.get('level') >= 15 && message.guild.settings.get('roles.memberplus')) {
            await message.member.roles.add(message.guild.settings.get('roles.memberplus') as string);
        }

        if (message.author.settings.get('level') >= 30 && message.guild.settings.get('roles.memberpro')) {
            await message.member.roles.add(message.guild.settings.get('roles.memberpro') as string);
        }

        if (message.author.settings.get('level') >= 50 && message.guild.settings.get('roles.memberedition')) {
            await message.member.roles.add(message.guild.settings.get('roles.memberedition') as string);
        }
    }

    getLevel(userXP: number) {
        let level = 0;
        let xp = 0;
        while (xp <= userXP) {
            xp = xp + 45 * level * (Math.floor(level / 10) + 1);
            level++;
        }
        return level;
    }
}
