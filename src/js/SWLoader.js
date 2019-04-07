import Host from './Host.js';
import templ from '../html/sw-loader.html';

/**
 * Session storage is used to store a flag when the service worker is updated.
 */
const storage = window.sessionStorage;

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
	 * Render the contents of this element and, if service workers are supported, load the service
	 * worker.
	 *
	 * @method connectedCallback
	 */
	connectedCallback() {
		super.connectedCallback();

		// Do not proceed if the browser doesn't support service workers.
		if (!('serviceWorker' in navigator)) {
			return;
		}

		/**
		 * Find all alert messages and use their id attributes (as keys) to generate the
		 * `this.alerts` object.
		 */
		this.alerts = this.queryAll('.alert').reduce((obj, el) => ({ [el.id]: el, ...obj }), {});

		// If the session storage contains the "updated" flag, show the "updated" alert message.
		if (storage.getItem('updated')) {
			this.fadeIn('updated');
			// Remove flag from session storage.
			storage.removeItem('updated');
		}

		// Register the service worker.
		navigator.serviceWorker.register('/sw.js').then((registration) => {
			// Listen for the "updatefound" event.
			registration.addEventListener('updatefound', event => this.updateFound(event));

			/**
			 * Show the "newVersion" message/prompt if there's a service worker that is
			 * installed/waiting.
			 */
			if (registration.waiting) {
				this.installedServiceWorker = registration.waiting;
				this.fadeIn('newVersion');
			}
		});
	}

	/**
	 * This method is executed every time a new service worker is being installed. It is meant to
	 * be used as the callback for the "updatefound" event triggered by the
	 * `ServiceWorkerRegistration` object.
	 *
	 * @method updateFound
	 * @param {Event} event The "updatefound" event triggered by the `ServiceWorkerRegistration`.
	 */
	updateFound(event) {
		const registration = event.target;
		const { active, installing } = registration;

		// Listed for "statechange" events on the `installing` service worker.
		installing.onstatechange = () => {
			if (!active && installing.state === 'activated') {
				/**
				 * Show the "installed" alert message if the `installing` service worker reached an
				 * "activated" state and there was no `active` service worker previously (in other
				 * words, if the service worker was installed and activated for the first time).
				 */
				this.fadeIn('installed');
			} else if (active && installing.state === 'installed') {
				/**
				 * Show the "newVersion" alert message/prompt if the `installing` service worker
				 * reached an "installed" state and there's already an `active` service worker.
				 */
				this.installedServiceWorker = installing;
				this.fadeIn('newVersion');
			}
		};
	}

	/**
	 * Fades in the specified alert message.
	 *
	 * @method fadeIn
	 * @param {string} name Name of the alert message to show. Must match the id attribute of any
	 *     of the alert elements in the template.
	 */
	fadeIn(name) {
		this.alerts[name].classList.add('fade-in');
	}

	/**
	 * Fades out the specified alert message.
	 *
	 * @method fadeOut
	 * @param {string} name Name of the alert message to fade out. Must match the id attribute of
	 *     any of the alert elements in the template.
	 */
	fadeOut(name) {
		this.alerts[name].classList.add('fade-out');
		this.alerts[name].classList.remove('fade-in');
	}

	/**
	 * Updates the service worker. This is meant to be used as callback for the "click" event of
	 * the button inside the "newVersion" alert message.
	 *
	 * @method update
	 */
	update() {
		// Get a hold of the "installed" service worker.
		const sw = this.installedServiceWorker;

		// When it becomes "activated", set an "updated" flag (in session storage) and reload page.
		sw.onstatechange = () => {
			if (sw.state === 'activated') {
				storage.setItem('updated', true);
				window.location.reload();
			}
		};

		// Send a message to the service worker telling it to exectue `skipWaiting`.
		sw.postMessage('skipWaiting');
	}
}

// Define the <sw-loader> element.
window.customElements.define('sw-loader', SWLoader);