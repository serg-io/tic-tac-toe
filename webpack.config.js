/**
 * Webpack configuration file.
 */
const path = require('path');
const pkg = require('./package.json');

module.exports = {
	context: path.resolve(__dirname, 'build/prebuild'),
	entry: `./v${ pkg.version }/js/TicTacToe.js`,
	resolve: {
		alias: {
			/**
			 * Use the minified HTML files (generated by the "build-html-preminify" NPM script)
			 * instead of the HTML files in the src directory.
			 */
			'../html': '../../../tmp/html',
			/**
			 * Tell webpack where to find the infuse.host source code files.
			 */
			'./libs/infuse.host': 'infuse.host/src',
		},
	},
	module: {
		rules: [{
			test: /\.html$/,
			use: [{
				// Use the "infuse-loader" to load HTML files.
				loader: 'infuse-loader',
				options: {
					// Tell webpack where to find the infuse.host configs file.
					configsPath: 'infuse.host/src/configs.js',
				},
			}],
		}],
	},
	// Write the output to build/dist/js/bundle.js
	output: {
		path: path.resolve(__dirname, `build/dist/v${ pkg.version }/js`),
		filename: 'bundle.js'
	},
};