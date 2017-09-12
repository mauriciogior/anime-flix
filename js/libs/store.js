const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
	constructor(opts) {
		// Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
		// app.getPath('userData') will return a string of the user's app data directory path.
		const userDataPath = (electron.app || electron.remote.app).getPath('userData');
		// We'll use the `configName` property to set the file name and path.join to bring it all together as a string
		this.path = path.join(userDataPath, opts.configName + '.json');
		
		this.data = parseDataFile(this.path, opts.defaults);
	}
	
	// This will just return the property on the `data` object
	get(key) {
		return this.data[key];
	}
	
	// ...and this will set it
	set(key, val) {
		this.data[key] = val;
		// Wait, I thought using the node.js' synchronous APIs was bad form?
		// We're not writing a server so there's not nearly the same IO demand on the process
		// Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
		// we might lose that data. Note that in a real app, we would try/catch this.
		fs.writeFileSync(this.path, JSON.stringify(this.data));
	}

	// Searches an element using the index table
	search(index, key) {
		var _self = this

		if (!this.data['index']) return
		if (!this.data['index'][index]) return

		let keys = Object.keys(this.data['index'][index])
		let docs = keys.map(function(text) {
			if (text.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
				let i = _self.data['index'][index][text]
				return _self.data['docs'][i]
			}
		}).filter(function(text) {
			return text !== undefined
		});

		return docs
	}

	// Searches an element using the index table
	indexOf(index, key) {
		var _self = this

		if (!this.data['index']) return
		if (!this.data['index'][index]) return

		let keys = Object.keys(this.data['index'][index])
		let indexes = keys.map(function(text) {
			if (text.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
				return _self.data['index'][index][text]
			}
		}).filter(function(text) {
			return text !== undefined
		});

		return indexes
	}

	// Build index tree
	buildIndex(index) {
		var _self = this

		// Gather all indexes
		let indexes = this.data['index'] || {}

		// Deletes current index to build
		indexes[index] = {}

		// Loop through all docs
		for (let i in this.data['docs']) {
			let doc = this.data['docs'][i]
			indexes[index][doc[index]] = i
		}

		// Saves index tree
		this.set('index', indexes)
	}
}

function parseDataFile(filePath, defaults) {
	// We'll try/catch it in case the file doesn't exist yet, which will be the case on the first application run.
	// `fs.readFileSync` will return a JSON string which we then parse into a Javascript object
	try {
		return JSON.parse(fs.readFileSync(filePath));
	} catch(error) {
		// if there was some kind of error, return the passed in defaults instead.
		return defaults;
	}
}

// expose the class
module.exports = Store;
