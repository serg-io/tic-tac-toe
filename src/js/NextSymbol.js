import BoardTile from './BoardTile.js';
import templ from '../html/next-symbol.html';

export default class NextSymbol extends BoardTile {
	// eslint-disable-next-line class-methods-use-this
	get template() {
		return templ;
	}

	symbolChanged(oldValue, newValue) {
		if (newValue === 'x') {
			this.xTileClass = 'raise';

			if (oldValue) {
				this.oTileClass = 'lower';
			}
		} else {
			this.oTileClass = 'raise';

			if (oldValue) {
				this.xTileClass = 'lower';
			}
		}

		this.dispatch(new CustomEvent('symbol-changed', { bubbles: false, cancelable: true }));
	}
}

window.customElements.define('next-symbol', NextSymbol);