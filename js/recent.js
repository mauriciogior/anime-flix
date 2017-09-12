const Store = require('./libs/store.js')
const parser = require('./libs/parser.js')

class Page {
	constructor() {
		// Our anime recent list store
		this.storeAnimeRecentList = new Store({
			configName: 'anime-recent-list',
			defaults: {
				index: {},
				docs: []
			}
		})
	}

	init() {
		var _self = this

		var $content = $('article[item=recent]')

		var animes = this.storeAnimeRecentList.get('docs')

		if (animes.length == 0) {
			// TODO

		} else {
			var $animes = $content.find('ul.animes')

			for (let i in animes) {
				let anime = animes[i]
				let cover = anime['cover']
				let name = anime['name']

				let $anime = $("<li>")
				$anime.append("<img class='cover' src='" + cover + "'/>")
				$anime.append("<span class='name'>" + name + "</span>")
				$animes.append($anime)
			}
		}
	}
}

// expose the class
module.exports = Page
