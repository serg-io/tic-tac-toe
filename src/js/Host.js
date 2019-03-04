/**
 * All custom elements defined in this application are extended from the class defined here. This
 * module is a good place to include methods used by all custom elements.
 */

// eslint-disable-next-line import/no-unresolved
import { CustomHost as InfuseCustomHost } from './libs/infuse.host/infuse.js';

/**
 * Defines a custom element class that includes methods used by all custom elements.
 *
 * @function CustomHost
 * @param ElementClass The class of the element to extend.
 * @returns A custom element that extends the given `ElementClass` class.
 */
export function CustomHost(ElementClass) {
	return class extends InfuseCustomHost(ElementClass) {
		/**
		 * Returns the **first** descendant that matches the given selector.
		 *
		 * @method query
		 * @param {string} selector The selector string.
		 * @returns {Element} The first descendant that matches the selector or `null` if there are
		 *     no matches.
		 */
		query(selector) {
			return this.querySelector(selector);
		}

		/**
		 * Returns **all** descendants that match the given selector.
		 *
		 * @method queryAll
		 * @param {string} selector The selector string.
		 * @returns {Element[]} An array containing all descendants that match the given selector.
		 *     If there are no matches, an empty array is returned.
		 */
		queryAll(selector) {
			return Array.from(this.querySelectorAll(selector));
		}

		/**
		 * Dispatches a given native `Event` or creates a `CustomEvent` (that is cancelable,
		 * bubbles up the DOM, and optionally has a `detail` value) and dispatches it.
		 *
		 * @method dispatch
		 * @param {(Event|string)} event The `Event` instance or the type of `CustomEvent` to
		 *     dispatch.
		 * @param [detail = null] The value to use as the custom event's detail value. This is used
		 *     only if the first argument is a string (the type of the custom event to dispatch).
		 */
		dispatch(event, detail = null) {
			const eventInit = { bubbles: true, cancelable: true, detail };
			const ev = event instanceof Event ? event : new CustomEvent(event, eventInit);

			return this.dispatchEvent(ev);
		}
	};
}

/**
 * A base class that extends `HTMLElement` that can be used to define custom elements.
 *
 * @class
 */
export default class Host extends CustomHost(HTMLElement) {}