const Source = require('./models/source.js')
const Anime = require('./models/anime.js')
const parsers = require('./libs/parser.js')

class Page {
	constructor() { }

	init() {
		var _self = this

		var $content = $('article[item=browse]')

		var animes = Anime.all()
		var sourceName = Source.active()

		var Parser = parsers[sourceName]
		var parser = new Parser()

		if (animes.length == 0) {
			$('.loading').removeClass('hidden')
			$('.loading .message').html('Loading anime list')

			parser.downloadAnimeList(function(animes) {
				$('.loading').addClass('hidden')

				Anime.init(animes)

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
				$anime.attr("anime-id", animes[i].id)
				$anime.append("<img class='cover' src='" + cover + "'/>")
				$anime.append("<span class='name'>" + name + "</span>")
				$animes.append($anime)
			}
		}
	}
}

// expose the class
module.exports = Page
