#!/usr/bin/env node

const path = require('path');
const { cli, searchFiles, UTF8, ...fs } = require('./utils');

const REG_EXP = /\{\{\s*(\S+)\s*\}\}/g;

// Parse CLI options and arguments.
const { args, options } = cli(['cwd', 'data', 'data-module']);

// Use the --cwd CLI option if one was given, otherwise use `process.cwd()`.
const cwd = options.cwd ? path.resolve(options.cwd) : process.cwd();

// First argument: file search pattern.
const pattern = args[0];

// Second argument: path to the output directory.
const outputDir = path.resolve(args[1]);

/**
 * Reads the contents of the specified `filePath`, replaces all occurrences of {{ key }} (where
 * `key` is the name of an attribute in `data`), and writes the result to the specified
 * `destination`.
 *
 * @function prebuildFile
 * @param {string} filePath Path to the input file.
 * @param {string} destination Path to the output file.
 * @param {Object} data The data object.
 */
async function prebuildFile(filePath, destination, data) {
	const code = await fs.readFile(filePath, UTF8);
	const output = code.replace(REG_EXP, (match, key) => data[key]);

	// Create containing output directory.
	await fs.mkdir(path.dirname(destination), { recursive: true });

	// Write minified source code to `destination`.
	await fs.writeFile(destination, output, UTF8);
}

(async function run() {
	let { data } = options;

	if (data) {
		// If a --data option was given in the CLI, parse it.
		data = JSON.parse(data);
	} else {
		const module = options['data-module'];

		// If --data-module was used, require the specified module. Otherwise, use the package.json.
		// eslint-disable-next-line
		data = require(module ? path.resolve(module) : '../package.json');

		// If `data` is a function, execute it to obtain the final data object.
		if (typeof data === 'function') {
			data = data();

			if (data instanceof Promise) {
				data = await data;
			}
		}
	}

	// Search for files in `cwd` that match the given `pattern` (do NOT follow symlinks).
	const files = await searchFiles(pattern, { cwd });

	// Minify each file and create an array of promises.
	const promises = files.map((file) => {
		const filePath = path.resolve(cwd, file);
		const dest = path.resolve(outputDir, file);

		return prebuildFile(filePath, dest, data);
	});

	// Wait until all promises are resolved before ending execution.
	await Promise.all(promises);
}());