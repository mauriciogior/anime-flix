const Store = require('./libs/store.js')
const parser = require('./libs/parser.js')

class Page {
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

		// Our anime list store
		this.storeAnimeList = new Store({
			configName: 'anime-list',
			defaults: {
				index: {},
				docs: []
			}
		})
	}

	init() {
		var _self = this

		var $content = $('article[item=browse]')

		var animes = this.storeAnimeList.get('docs')
		var sourceName = this.storeAnimeSource.get('active')

		var Source = parser[sourceName]
		var source = new Source()

		if (animes.length == 0) {
			$('.loading').removeClass('hidden')
			$('.loading .message').html('Loading anime list')

			source.downloadAnimeList(function(animes) {
				$('.loading').addClass('hidden')

				_self.storeAnimeList.set('docs', animes)
				_self.storeAnimeList.buildIndex('name')

				// Avoid loops in case of error
				if (animes.length > 0) {
					_self.init()
				}
			})

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
