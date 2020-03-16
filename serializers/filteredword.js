const { Serializer } = require('klasa');
const FilteredWord = require('../util/filteredWord')

module.exports = class extends Serializer {

	async deserialize(data, piece, language) {
    return new FilteredWord(data);
	}

	serialize(c) {
		return c;
	}

	stringify(c) {
		return c;
	}

};
