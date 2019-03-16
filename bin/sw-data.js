/**
 * This module provides a function that returns the data needed to prebuild the service worker file.
 */

const path = require('path');
const { searchFiles } = require('./utils');
const { version } = require('../package.json');

// Find the build/dist directory.
const dist = path.resolve(__dirname, '../build/dist');

/**
 * Returns an object with the version number (obtained from the package.json file) and an array (as
 * a JSON string) of all the files in the build/dist/version directory.
 */
module.exports = async function data() {
	const versionFiles = await searchFiles(`v${ version }/**/*`, { cwd: dist, nodir: true });
	const files = ['index.html', ...versionFiles].map(file => `/${ file }`).join(',');

	return { version, files };
};