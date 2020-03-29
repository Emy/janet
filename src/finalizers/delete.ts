import { Finalizer, KlasaMessage } from 'klasa';

export default class extends Finalizer {
    async run(msg: KlasaMessage) {
        if (msg.guild && msg.deletable) {
            await msg.delete({ timeout: 2500 });
        }
    }
}
