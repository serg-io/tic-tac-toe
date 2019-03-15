const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const glob = require('glob');

const FS_ASYNC_FUNCTIONS = ['readFile', 'mkdir', 'writeFile'];

/**
 * Name for the UTF-8 character set.
 */
exports.UTF8 = 'utf8';

/**
 * Promisifies a function.
 *
 * @function promisify
 * @param {Function} fn The function to promisify.
 * @return {Function} The promisified function.
 */
exports.promisify = function promisify(fn) {
	return (...args) => new Promise((resolve, reject) => {
		fn(...args, (error, result) => (error ? reject(error) : resolve(result)));
	});
};

/**
 * Create a promisified version of the
 * [`glob`](https://www.npmjs.com/package/glob#globpattern-options-cb) function, which will be used
 * to search for files that match a given pattern.
 *
 * @function searchFiles
 */
exports.searchFiles = exports.promisify(glob);

/**
 * Parses CLI options and positional CLI arguments.
 *
 * @function cli
 * @param {string[]} [keys=[]] The option keys.
 * @returns {Object} An object with the following attributes:
 *     * args: An array containing the parsed positional arguments.
 *     * options: An object containing the parsed CLI options.
 */
exports.cli = function cli(keys) {
	const args = process.argv.slice(2);

	const options = keys.reduce((opts, key) => {
		const i = args.indexOf(`--${ key }`);

		if (i !== -1) {
			// eslint-disable-next-line no-param-reassign
			opts[key] = args[i + 1];
			args.splice(i, 2);
		}

		return opts;
	}, {});

	return { args, options };
};

/**
 * Promisify the functions listed in `FS_ASYNC_FUNCTIONS` and add them to `exports`.
 */
FS_ASYNC_FUNCTIONS.forEach((key) => {
	exports[key] = exports.promisify(fs[key]);
});