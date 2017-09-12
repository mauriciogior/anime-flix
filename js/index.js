const Store = require('./libs/store.js')
const parser = require('./libs/parser.js')

// Our default configs
const storeIndexConfigs = new Store({
	configName: 'index-configs',
	defaults: {
		page: 'browse'
	}
})

const storeAnimeSource = new Store({
	configName: 'anime-source',
	defaults: {
		index: {},
		docs: [{
			'name': 'animetake'
		}],
		active: 'animetake'
	}
})

const storeAnimeList = new Store({
	configName: 'anime-list',
	defaults: {
		index: {},
		docs: []
	}
})

// Gather our page
var currPage = storeIndexConfigs.get('page')

$(document).ready(function() {

	$('section.bar ul.menu li').on('click', function(event) {
		$('section.video').addClass('hidden').find('video').remove()

		$(this).siblings('li').removeClass('active')
		$(this).addClass('active')

		currPage = $(this).attr('item')
		let Page = loadPage(currPage)
		
		page = new Page()
		page.init()
	})

	$('section.contents').on('click', 'article[item] ul.animes li', function(event) {
		$('section.video').addClass('hidden').find('video').remove()

		let name = $(this).find('span.name').html()
		let anime = storeAnimeList.search('name', name)

		if (anime) {
			let title = $('section.bar ul.menu li[item=' + currPage + ']').text()
			let Page = loadPage('anime')
			
			let page = new Page(anime[0])
			page.init({ title, page: currPage })
		}
	})

	$('section').on('click', 'ul.breadcrumb li', function(event) {
		$('section.video').addClass('hidden').find('video').remove()

		let page = $(this).attr('item')
		let Page = loadPage(page)
		
		if (page == 'anime') {
			let name = $(this).text()
			let anime = storeAnimeList.search('name', name)

			if (anime) {
				let page = new Page(anime[0])
				page.init()
			}

		} else {
			currPage = page

			page = new Page()
			page.init()
		}
	})

	$('section.contents').on('click', 'ul.episodes li', function(event) {
		var $el = $(this)
		var $video = $('section.video')

		var sourceName = storeAnimeSource.get('active')

		var Source = parser[sourceName]
		var source = new Source()

		var ep = $(this).data('ep')
		var name = $(this).data('anime')

		var $videoContainer = $('section.video')

		if (ep.videoUrl === undefined) {
			$('.loading .message').html('Loading episode information')
			$('.loading').removeClass('hidden')

			source.downloadEpisodeInformation(ep, function(episode) {
				$('.loading').addClass('hidden')

				if (episode === undefined) return

				let animes = storeAnimeList.get('docs')
				let index = storeAnimeList.indexOf('name', name)
				let anime = animes[index[0]]

				for (let i in anime.episodes) {
					if (anime.episodes[i].url == episode.url) {
						anime.episodes[i].videoUrl = episode.videoUrl
						break
					}
				}

				animes[index[0]] = anime
				storeAnimeList.set('docs', animes)

				$el.trigger('click')
			})

		} else {
			let $bcPage = $(this).closest('section').find('ul.breadcrumb li:nth-child(1)')
			let $bcAnime = $(this).closest('section').find('ul.breadcrumb li:nth-child(2)')

			$videoContainer
				.find('ul.breadcrumb li[item=page]')
				.attr('item', $bcPage.attr('item'))
				.html($bcPage.text())

			$videoContainer
				.find('ul.breadcrumb li[item=anime]')
				.html($bcAnime.text())

			$videoContainer
				.find('ul.breadcrumb li[item=episode]')
				.html(ep.name)

			$videoContainer.removeClass('hidden')
			$videoContainer.find('video').remove()

			let $video = $('<video controls="" preload="auto" autoplay="" poster="">')
			$video.append('<source src="' + source.path + ep.videoUrl[0] + '">')
			$videoContainer.append($video)
		}
	})

	$('section.contents').on('keyup', '.search input', function() {
		var $contents = $(this).closest('section.contents')
		var $animes = $contents.find('ul.animes li')

		var val = $(this).val().toLowerCase()

		if (val == "") {
			$animes.show()
		} else {
			$animes.each(function() {
				if ($(this).find('.name').text().toLowerCase().indexOf(val) == -1) {
					$(this).hide()
				} else {
					$(this).show()
				}
			})
		}
	});

	$('section.bar ul.menu li[item=' + currPage + ']').trigger('click')
})
