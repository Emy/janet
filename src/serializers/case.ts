import { Serializer, SerializerStore } from 'klasa';
import Case from '../util/case';

export default class extends Serializer {
    constructor(store: SerializerStore, file: string[], dir: string) {
        super(store, file, dir);
    }

    async deserialize(data) {
        return new Case(data);
    }

    serialize(data) {
        return data;
    }

    stringify(data) {
        return data;
    }
}
