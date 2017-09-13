const Store = require('../libs/store.js')

class Source {

	constructor() {
		// Our default source store
		this.storeAnimeSource = new Store({
			configName: 'anime-source',
			defaults: {
				index: {},
				docs: [{
					'name': 'animetake'
				}],
				active: 'animetake'
			}
		})
	}

	all() {
		return this.storeAnimeSource.get('docs')
	}

	active() {
		return this.storeAnimeSource.get('active')
	}
}

// expose the class
module.exports = new Source()
