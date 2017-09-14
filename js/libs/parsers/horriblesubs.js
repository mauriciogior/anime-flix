var cloudscraper = require('cloudscraper')

// Our Horriblesubs source parser
class Horriblesubs {
	// Builds our source
	constructor() {
		this.path = 'http://horriblesubs.info'
	}

	// Downloads entire anime directory
	downloadAnimeList(callback) {
		let url = this.path + '/shows/'
		var _self = this

		cloudscraper.get(url, function (error, response, body) {

			if (!error) {
				var $doc = $(body)
				var $animes = $doc.find('.ind-show.linkful')

				var animes = []
				var index = 0

				$animes.each(function() {

					let a = $(this).find('a').first()

					let name = a.text()
					let url = a.attr('href')

					animes.push({
						id: index++,
						name: name,
						url: url
					})
				})

				callback(animes)

			} else {
				callback([])
			}

		})
	}

	// Downloads the anime information
	downloadAnimeInformation(anime, callback) {
		let url = this.path + anime.url
		var _self = this

		cloudscraper.get(url, function (error, response, body) {

			if (!error) {
				var $doc = $(body)

				// Capture showId
				var regex = "var hs_showid = ([0-9]+)"
				var showId = body.match(regex)
				showId = showId[1]

				// Saves anime information
				let cover = $doc.find('.series-info .series-image img').attr('src')
				let description = $doc.find('.series-info .series-desc').text().trim()

				anime.cover = cover
				anime.description = description

				// Url to search all episode links
				var epsUrl = _self.path + '/lib/getshows.php?type=show&showid=' + showId
				var lastBody = ''
				var episodes = []
			
				// Download all episodes from url
				function downloadEpisode(nextid) {

					console.log('episode page ' + nextid)

					cloudscraper.get(epsUrl + '&nextid=' + nextid, function (error, response, body) {
						anime.episodes = episodes

						if (!error) {
							if (body.trim() != 'DONE' && body != lastBody) {
								lastBody = body // To avoid loops if something changes

								var $doc = $(body)
								var $links = $doc.siblings('div.release-links')

								$links.each(function() {
									var name = $(this).find('td.dl-label').text()
									var url  = $(this).find('td.hs-magnet-link a').attr('href')
									var videoUrl = [url]

									episodes.push({ name, url, videoUrl })
								})

								// Next page
								downloadEpisode(nextid + 1)
							} else {
								callback(anime)	
							}
						} else {
							callback(anime)
						}
					})
				}

				// Download episodes from start
				downloadEpisode(0)

			} else {
				callback(undefined)
			}

		})
	}

	// Downloads the episode information
	downloadEpisodeInformation(episode, callback) {
		callback(episode)
	}
}

// expose the class
module.exports = Horriblesubs
