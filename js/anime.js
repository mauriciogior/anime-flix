const Store = require('./libs/store.js')
const parser = require('./libs/parser.js')

class Page {
	constructor(anime) {
		// Our anime information
		this.anime = anime

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

		if (this.anime.episodes === undefined) {
			$('.loading').removeClass('hidden')
			$('.loading .message').html('Loading anime information')

			let sourceName = this.storeAnimeSource.get('active')

			let Source = parser[sourceName]
			let source = new Source()

			source.downloadAnimeInformation(this.anime, function(anime) {
				$('.loading').addClass('hidden')

				if (anime === undefined) return

				let animes = _self.storeAnimeList.get('docs')
				let index = _self.storeAnimeList.indexOf('name', anime.name)
				animes[index[0]] = anime

				_self.anime = anime

				_self.storeAnimeList.set('docs', animes)
				_self.storeAnimeList.buildIndex('name')

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

				$ep.data('ep', ep)
				$ep.data('anime', _self.anime.name)
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
