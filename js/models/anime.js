const Store = require('../libs/store.js')

class Anime {

	constructor() {
		// Our anime list store
		this.storeAnimeList = new Store({
			configName: 'anime-list',
			defaults: {
				index: {},
				docs: []
			}
		})
	}

	refreshIndexes() {
		this.storeAnimeList.buildIndex('name')
		this.storeAnimeList.buildIndex('favorited')
		this.storeAnimeList.buildIndex('downloaded')
		this.storeAnimeList.buildIndex('lastWatched')
	}

	all() {
		return this.storeAnimeList.get('docs')
	}

	get(id) {
		if (id == -1) return undefined

		let animes = this.all()
		return animes[id]
	}

	search(key, val) {
		return this.storeAnimeList.search(key, val)
	}

	has(key) {
		let animes = this.all()
		return animes.filter(function(anime) {
			return anime[key] !== undefined
		})
	}

	save(anime) {
		let animes = this.all()
		let exist = this.get(anime.id)

		// Updates the anime list
		if (exist) {
			animes[anime.id] = anime
		} else {
			anime.id = animes.length
			animes.push(anime)
		}

		// Persist data
		this.storeAnimeList.set('docs', animes)
		this.refreshIndexes()
	}

	init(animes) {
		// Persist data
		this.storeAnimeList.set('docs', animes)
		this.refreshIndexes()
	}
}

// expose the class
module.exports = new Anime()
