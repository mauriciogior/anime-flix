const Source = require('./models/source.js')
const Anime = require('./models/anime.js')

const parsers = require('./libs/parser.js')

class Page {
	constructor(anime) {
		// Our anime information
		this.anime = anime
	}

	init() {
		var _self = this

		if (this.anime.episodes === undefined || this.anime.episodes.length == 0) {
			$('.loading').removeClass('hidden')
			$('.loading .message').html('Loading anime information')

			var sourceName = Source.active()

			var Parser = parsers[sourceName]
			var parser = new Parser()

			parser.downloadAnimeInformation(this.anime, function(anime) {
				$('.loading').addClass('hidden')

				if (anime === undefined) return

				Anime.save(anime)

				_self.anime = anime
				_self.init()
			})

		} else {
			let $content = $('article[item=anime]')
			let $breadcrumb = $content.siblings('.breadcrumb')
			let $header = $content.find('.header')
			let $episodes = $content.find('ul.episodes')
			let $page = $('section.bar ul.menu li.active')

			$breadcrumb.find('li[item=page]').attr('item', $page.attr('item')).html($page.text())
			$breadcrumb.find('li[item=anime]').html(this.anime.name)

			$header.find('.cover').attr('src', this.anime.cover)
			$header.find('.details .name').html(this.anime.name)
			$header.find('.details .description').html(this.anime.description)

			for (let i in this.anime.episodes) {
				let ep = this.anime.episodes[i]
				let $ep = $('<li>');

				$ep.data('episode', ep)
				$ep.data('anime', _self.anime.id)
				$ep.append('<span class="name"></span>')
				$ep.append('<span class="description"></span>')
				$ep.append('<span class="date"></span>')

				$ep.find('.name').html(ep.name)
				$ep.find('.description').html(ep.description)
				$ep.find('.date').html(ep.date)
				
				$episodes.append($ep)
			}
		}
	}
}

// expose the class
module.exports = Page
