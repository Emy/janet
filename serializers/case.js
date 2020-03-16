const { Serializer } = require('klasa');
const Case = require('../util/case')

module.exports = class extends Serializer {

	async deserialize(data, piece, language) {
    return new Case(data);
	}

	serialize(c) {
		return c;
	}

	stringify(c) {
		return c;
	}

};