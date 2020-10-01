import { GuildMember } from 'discord.js';
import { Event, EventStore } from 'klasa';
import JanetClient from '../lib/client';
import Dispatcher from '../util/dispatcher';

export default class extends Event {
    client: JanetClient;
    constructor(client: JanetClient, store: EventStore, file: string[], dir: string) {
        super(store, file, dir, {
            enabled: true,
            once: false,
        });
    }

    async run(oldMember: GuildMember, newMember: GuildMember) {
        if (!(oldMember && newMember)) return;
        const dispatcher = this.client.queue.get(oldMember.guild.id) as Dispatcher;
        if (!dispatcher) return;
        const voiceChannel = oldMember.guild.channels.cache.get(dispatcher.player.voiceConnection.voiceChannelID);
        if (voiceChannel.members.size === 1) dispatcher.onEvent(undefined);
    }
}
