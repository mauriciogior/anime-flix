const Anime = require('./models/anime.js')
const parser = require('./libs/parser.js')

class Page {
	constructor() { }

	init() {
		var _self = this

		var $content = $('article[item=favorites]')

		var animes = Anime.has('favorited')

		if (animes.length == 0) {
			// TODO

		} else {
			var $animes = $content.find('ul.animes')

			for (let i in animes) {
				let anime = animes[i]
				let cover = anime['cover'] || './cover.jpg'
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
