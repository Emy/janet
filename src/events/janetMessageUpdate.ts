import { Event, EventStore, KlasaClient, KlasaMessage } from 'klasa';

export default class extends Event {
    constructor(client: KlasaClient, store: EventStore, file: string[], dir: string) {
        super(client, store, file, dir, {
            enabled: true,
            name: 'janetMessageUpdate',
            event: 'messageUpdate',
        });
    }

    async run(oldMsg: KlasaMessage, newMsg: KlasaMessage) {
        if (this.client.ready && !oldMsg.partial && oldMsg.content !== newMsg.content) this.client.monitors.run(newMsg);
    }
}
