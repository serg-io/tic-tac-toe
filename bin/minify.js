#!/usr/bin/env node

const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const Terser = require('terser');
const { cli, searchFiles, UTF8, ...fs } = require('./utils');

// Parse CLI options and arguments.
const { args, options } = cli(['cwd']);

// Use the --cwd CLI option if one was given, otherwise use `process.cwd()`.
const cwd = options.cwd ? path.resolve(options.cwd) : process.cwd();

// First argument: file search pattern.
const pattern = args[0];

// Second argument: path to the output directory.
const outputDir = path.resolve(args[1]);

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
		// eslint-disable-next-line
		console.error(`Error minifying ${ source }`);
		throw result.error;
	}

	// Create containing output directory.
	await fs.mkdir(path.dirname(destination), { recursive: true });

	// Write minified source code to `destination`.
	await fs.writeFile(destination, result.code, UTF8);
}

(async function run() {
	// Search for files in `cwd` that match the given `pattern` (do NOT follow symlinks).
	const files = await searchFiles(pattern, { cwd, follow: false });

	// Minify each file and create an array of promises.
	const promises = files.map((file) => {
		const src = path.resolve(cwd, file);
		const dest = path.resolve(outputDir, file);

		return minifyESModule(src, dest);
	});

	// Wait until all promises are resolved before ending execution.
	await Promise.all(promises);
}());