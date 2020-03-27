import { GuildMember } from 'discord.js';
import { Event, EventStore } from 'klasa';
import JanetClient from '../lib/client';
import Dispatcher from '../util/dispatcher';

export default class extends Event {
    client: JanetClient;
    constructor(client: JanetClient, store: EventStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            once: false,
        });
    }

    async run(oldMember: GuildMember, newMember: GuildMember) {
        if (!(oldMember && newMember)) return;
        const dispatcher = this.client.queue.get(oldMember.guild.id);
        if (!dispatcher) return;
        dispatcher as Dispatcher;
        const voiceChannel = oldMember.guild.channels.cache.get(dispatcher.player.voiceConnection.voiceChannelID);
        if (voiceChannel.members.size === 1) dispatcher.onEvent();
    }
}
