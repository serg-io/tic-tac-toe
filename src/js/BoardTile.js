import Host from './Host.js';
import templ from '../html/board-tile.html';

/**
 * Class definition for the <board-tile> custom element.
 */
export default class BoardTile extends Host {
	/**
	 * Default SVG image to use as the X symbol.
	 */
	static get DEFAULT_X() {
		return '/img/x.svg';
	}

	/**
	 * Default SVG image to use as the O symbol.
	 */
	static get DEFAULT_O() {
		return '/img/o.svg';
	}

	/**
	 * Observe the "symbol", "x-src", and "o-src" attributes and call `attributeChangedCallback`
	 * whenever they're changed.
	 */
	static get observedAttributes() {
		return ['symbol', 'x-src', 'o-src'];
	}

	/**
	 * It adds an event listener for the "animationend" to this instance. The "animationend" event
	 * is triggered when the tile finishes flipping.
	 *
	 * @constructor
	 */
	constructor() {
		super();
		this.addEventListener('animationend', () => {
			this.classList.remove('flipping');
			this.removeAttribute('animation-symbol');
		});
	}

	/**
	 * This getter returns the template to use when the element is rendered.
	 */
	// eslint-disable-next-line class-methods-use-this
	get template() {
		return templ;
	}

	/**
	 * This callback is executed every time the "symbol", "x-src", or "o-src" attributes are
	 * changed. The `symbolChanged` method is called when the "symbol" attribute is changed. When
	 * the "x-src" or "o-src" are changed, the `newValue` is used as the "src" attribute of the
	 * corresponding <img> element (if `newValue` is falsy, the corresponding default symbol image
	 * is used instead).
	 *
	 * @method attributeChangedCallback
	 * @param {string} name Name of the attribute that was changed.
	 * @param {string} oldValue The previous value of the attribute.
	 * @param {string} newValue The new value of the attribute.
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'symbol') {
			this.symbolChanged(oldValue, newValue);
		} else if (name === 'x-src') {
			this.query('img.x-symbol').src = newValue || BoardTile.DEFAULT_X;
		} else {
			this.query('img.o-symbol').src = newValue || BoardTile.DEFAULT_O;
		}
	}

	/**
	 * This is called every time the "symbol" attribute changes. It initiates the flipping
	 * animation.
	 *
	 * @method symbolChanged
	 * @param {string} oldValue Previous symbol or `null`.
	 * @param {string} newValue New symbol or `null`.
	 */
	symbolChanged(oldValue, newValue) {
		this.classList.add('flipping');
		this.setAttribute('flip-side-up', !newValue ? 'front' : 'back');

		if (oldValue) {
			this.setAttribute('animation-symbol', oldValue);
		}
	}

	/**
	 * Causes the element to flip by assigning the given symbol and dispatches a "tile-flipped"
	 * custom event.
	 *
	 * @method flip
	 * @param {string} symbol Symbol to show when the card is flipped. Must be "x", "o", or `null`.
	 */
	flip(symbol) {
		this.symbol = symbol;
		this.dispatch('tile-flipped');
	}

	/**
	 * This getter returns the current symbol.
	 */
	get symbol() {
		return this.getAttribute('symbol');
	}

	/**
	 * This setter sets a new symbol. The value must be "x", "o", or `null`.
	 */
	set symbol(value) {
		if (value === this.symbol) {
			return;
		}

		if (value === 'x' || value === 'o') {
			this.setAttribute('symbol', value);
		} else {
			this.removeAttribute('symbol');
		}
	}

	/**
	 * Getter for the "x-src" attribute. If the attribute doesn't exist, the path to the
	 * corresponding default image is returned.
	 */
	get xSrc() {
		return this.getAttribute('x-src') || BoardTile.DEFAULT_X;
	}

	/**
	 * Sets a new value for the "x-src" attribute or remove the attribute if the given value is
	 * falsy.
	 */
	set xSrc(value) {
		if (value === this.xSrc) {
			return;
		}

		if (value) {
			this.setAttribute('x-src', value);
		} else {
			this.removeAttribute('x-src');
		}
	}

	/**
	 * Getter for the "o-src" attribute. If the attribute doesn't exist, the path to the
	 * corresponding default image is returned.
	 */
	get oSrc() {
		return this.getAttribute('o-src') || BoardTile.DEFAULT_O;
	}

	/**
	 * Sets a new value for the "o-src" attribute or remove the attribute if the given value is
	 * falsy.
	 */
	set oSrc(value) {
		if (value === this.oSrc) {
			return;
		}

		if (value) {
			this.setAttribute('o-src', value);
		} else {
			this.removeAttribute('o-src');
		}
	}
}

// Define the <board-tile> element.
window.customElements.define('board-tile', BoardTile);