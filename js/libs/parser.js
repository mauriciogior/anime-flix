var request = require('request')

// Our Animetake source parser
class Animetake {
	// Builds our source
	constructor() {
		this.path = 'https://animetake.tv'
	}

	// Downloads entire anime directory
	downloadAnimeList(callback) {
		let url = this.path + '/animelist/poster/'
		var _self = this

		request({ url: url }, function (error, response, body) {

			if (!error && response.statusCode === 200) {
				var $doc = $(response.body)
				var $posters = $doc.find('.animelist_poster')

				var animes = []

				$posters.each(function() {

					let a = $(this).find('a').first()
					let img = $(this).find('img').first()
					let center = $(this).find('center').first()

					let name = center.text()
					let url = a.attr('href')
					let cover = _self.path + img.attr('data-original')

					animes.push({
						name: name,
						url: url,
						cover: cover
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

		request({ url: url }, function (error, response, body) {

			if (!error && response.statusCode === 200) {
				var $doc = $(response.body)
				var $episodes = $doc.find('.list-group-item')

				var episodes = []

				$episodes.each(function() {
					let url = $(this).attr('href')
					let name = $(this).find('.list-group-item-heading').text().trim()
					let description = $(this).find('.list-group-item-text').text().trim()
					let date = $(this).find('.pull-right').text().trim()

					episodes.push({ url, name, description, date })
				})

				let description = $doc.find('.animeinfo-div .visible-md.visible-lg').text().trim()

				anime.episodes = episodes
				anime.description = description

				callback(anime)

			} else {
				callback(undefined)
			}

		})
	}

	// Downloads the episode information
	downloadEpisodeInformation(episode, callback) {
		let url = this.path + episode.url
		var _self = this

		request({ url: url }, function (error, response, body) {

			if (!error && response.statusCode === 200) {
				let videoUrls = ""
				let urlRegex = "(/redirect/[\\w\\d:#@%/$()~_?\\+-=\\\\\\.&]*)"
				let url = response.body.match(urlRegex)

				if (url) {
					episode.videoUrl = url
					callback(episode)
				} else {
					callback(undefined)
				}

			} else {
				callback(undefined)
			}

		})
	}
}

// expose the class
module.exports = {
	'animetake' : Animetake
}
