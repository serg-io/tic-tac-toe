#!/usr/bin/env node

/**
 * Promisifies a function.
 *
 * @function promisify
 * @param {Function} fn The function to promisify.
 * @return {Function} The promisified function.
 */
function promisify(fn) {
	return (...args) => new Promise((resolve, reject) => {
		fn(...args, (error, result) => (error ? reject(error) : resolve(result)));
	});
}

const path = require('path');
const filesystem = require('fs');
const Terser = require('terser');
const glob = promisify(require('glob'));

const UTF8 = 'utf8';

// Create an object with promisified versions of `readFile`, `mkdir`, and `writeFile`.
const fs = ['readFile', 'mkdir', 'writeFile'].reduce((obj, key) => {
	obj[key] = promisify(filesystem[key]);
	return obj;
}, {});

// First argument: file search pattern.
const pattern = process.argv[2];

// The second and third arguments are the input and output directories respectively.
const [cwd, outputDir] = process.argv.splice(3).map(dir => path.resolve(dir));

/**
 * Minifies an ES Module file.
 *
 * @function minifyESModule
 * @param {string} source Path to the ES module file.
 * @param {string} destination Path to the output minified file.
 * @returns {Promise}
 */
async function minifyESModule(source, destination) {
	const code = await fs.readFile(source, UTF8);
	const result = Terser.minify(code, { module: true });

	if (result.error) {
		console.error(`Error minifying ${ source }`);
		throw result.error;
	}

	// Create containing output directory.
	await fs.mkdir(path.dirname(destination), { recursive: true });

	// Write minified source code to `destination`.
	await fs.writeFile(destination, result.code, UTF8);
}

(async function() {
	// Search for files in `cwd` that match the given `pattern` (do NOT follow symlinks).
	const files = await glob(pattern, { cwd, follow: false });

	// Minify each file and create an array of promises.
	const promises = files.map(file => {
		const src = path.resolve(cwd, file);
		const dest = path.resolve(outputDir, file);

		return minifyESModule(src, dest);
	});

	// Wait until all promises are resolved before ending execution.
	return await Promise.all(promises);
})();