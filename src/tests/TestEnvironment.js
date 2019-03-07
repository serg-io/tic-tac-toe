/**
 * Jest uses JSDOM as the environment in which all the tests are executed. However, JSDOM doesn't
 * support custom elements, which cause certain tests to fail. As a workaround, this file defines
 * a `TestEnvironment` which adds a dummy `customElements` object and an `HTMLElement` class to
 * the global `window` variable. Adding these properties to `window` prevent the tests from failing
 * due to lack of support for custom elements.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const JSDOMEnvironment = require('jest-environment-jsdom');

/**
 * Extend the `JSDOMEnvironment` to define a new `TestEnvironment`.
 */
class TestEnvironment extends JSDOMEnvironment {
	async setup() {
		await super.setup();

		/**
		 * Add a `customElements` property (with a `define` function that does nothing) and an
		 * empty `HTMLElement` class to the global `window` variable.
		 */
		this.global.customElements = {
			define: function define() {},
		};
		this.global.HTMLElement = class HTMLElement {};
	}

	async teardown() {
		// Remove `customElements` and `HTMLElement` from the global `window` variable.
		delete this.global.customElements;
		delete this.global.HTMLElement;

		await super.teardown();
	}
}

module.exports = TestEnvironment;