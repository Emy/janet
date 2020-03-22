const { Serializer } = require('klasa');
const Case = require('../util/case')

module.exports = class extends Serializer {

	deserialize(data, piece, language) {
    return new Case(data);
	}

	serialize(data) {
		return data;
	}

	stringify(data) {
		return data;
	}

};