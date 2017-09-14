const Store = require('../libs/store.js')

class Source {

	constructor() {
		// Our default source store
		this.storeAnimeSource = new Store({
			configName: 'anime-source',
			defaults: {
				active: 'Animetake'
			}
		})
	}

	active() {
		return this.storeAnimeSource.get('active')
	}
}

// expose the class
module.exports = new Source()
