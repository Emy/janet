import { Serializer, KlasaClient, SerializerStore } from 'klasa';
import Case from '../util/case';

export default class extends Serializer {
	constructor(client: KlasaClient, store: SerializerStore, file: string[], dir: string) {
		super(client, store, file, dir)
	}

	async deserialize(data, piece, language) {
    	return new Case(data);
	}

	serialize(data) {
		return data;
	}

	stringify(data) {
		return data;
	}

};