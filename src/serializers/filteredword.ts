import { Serializer, SerializerStore } from 'klasa';
import FilteredWord from '../util/filteredWord';

export default class extends Serializer {
    constructor(store: SerializerStore, file: string[], dir: string) {
        super(store, file, dir);
    }

    async deserialize(data) {
        return new FilteredWord(data);
    }

    serialize(data) {
        return data;
    }

    stringify(data) {
        return data;
    }
}
