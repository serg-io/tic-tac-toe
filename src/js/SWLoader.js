import Host from './Host.js';
import templ from '../html/sw-loader.html';

/**
 * Class definition for the <sw-loader> custom element.
 */
export default class SWLoader extends Host {
	/**
	 * This getter returns the template to use when the element is rendered.
	 */
	// eslint-disable-next-line class-methods-use-this
	get template() {
		return templ;
	}

	/**
	 * Attempt to load the service worker after rendering the contents of this element.
	 *
	 * @method connectedCallback
	 */
	connectedCallback() {
		super.connectedCallback();
		this.load();
	}

	/**
	 * If the browser supports service workers it attempts to register a service worker. An alert
	 * is shown to the user when the service worker is activated for the very first time.
	 *
	 * @method load
	 */
	async load() {
		if (!('serviceWorker' in navigator)) {
			return;
		}

		// Register the service worker.
		const registration = await navigator.serviceWorker.register('/sw.js');
		const { active, installing } = registration;

		/**
		 * If it's `installing` the SW for the first time (there's no `active` SW), wait until the
		 * `state` of the `installing` SW is "activated" to show the alert to the user.
		 */
		if (!active && installing) {
			installing.onstatechange = () => {
				if (installing.state === 'activated') {
					this.show();
				}
			};
		}
	}

	/**
	 * Shows the contents of this element.
	 *
	 * @method show
	 */
	show() {
		this.classList.remove('fade-out');
		this.classList.add('fade-in');
	}

	/**
	 * Hides the contents of this element.
	 *
	 * @method hide
	 */
	hide() {
		this.classList.remove('fade-in');
		this.classList.add('fade-out');
	}
}

// Define the <sw-loader> element.
window.customElements.define('sw-loader', SWLoader);