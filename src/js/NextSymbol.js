import BoardTile from './BoardTile.js';
import templ from '../html/next-symbol.html';

/**
 * Class definition for the <next-symbol> custom element. Note that the BoardTile is extended here
 * since the <board-tile> and <next-symbol> elements share a lot of similarities, the only
 * differences between the two are the HTML templates and the `symbolChanged` method.
 */
export default class NextSymbol extends BoardTile {
	/**
	 * This getter returns the template to use when the element is rendered.
	 */
	// eslint-disable-next-line class-methods-use-this
	get template() {
		return templ;
	}

	/**
	 * Updates the values of the `xTileClass` and `oTileClass` and dispatches a "symbol-changed"
	 * event which updates the corresponding elements (see template for details) and initiates the
	 * "raise" and "lower" animations.
	 *
	 * @method symbolChanged
	 * @param {string} oldSymbol The previos symbol.
	 * @param {string} newSymbol The new symbol.
	 */
	symbolChanged(oldSymbol, newSymbol) {
		if (newSymbol === 'x') {
			this.xTileClass = 'raise';

			if (oldSymbol) {
				this.oTileClass = 'lower';
			}
		} else {
			this.oTileClass = 'raise';

			if (oldSymbol) {
				this.xTileClass = 'lower';
			}
		}

		this.dispatch(new CustomEvent('symbol-changed', { bubbles: false, cancelable: true }));
	}
}

// Define the <next-symbol> element.
window.customElements.define('next-symbol', NextSymbol);