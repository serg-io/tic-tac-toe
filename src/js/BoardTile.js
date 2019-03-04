import Host from './Host.js';
import templ from '../html/board-tile.html';

export default class BoardTile extends Host {
	static get DEFAULT_X() {
		return '/img/x.svg';
	}

	static get DEFAULT_O() {
		return '/img/o.svg';
	}

	static get observedAttributes() {
		return ['symbol', 'x-src', 'o-src'];
	}

	constructor() {
		super();
		this.addEventListener('animationend', () => {
			this.classList.remove('flipping');
			this.removeAttribute('animation-symbol');
		});
	}

	// eslint-disable-next-line class-methods-use-this
	get template() {
		return templ;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'symbol') {
			this.symbolChanged(oldValue, newValue);
		} else if (name === 'x-src') {
			this.query('img.x-symbol').src = newValue || BoardTile.DEFAULT_X;
		} else {
			this.query('img.o-symbol').src = newValue || BoardTile.DEFAULT_O;
		}
	}

	symbolChanged(oldValue, newValue) {
		this.classList.add('flipping');
		this.setAttribute('flip-side-up', !newValue ? 'front' : 'back');

		if (oldValue) {
			this.setAttribute('animation-symbol', oldValue);
		}
	}

	flip(symbol) {
		this.symbol = symbol;
		this.dispatch('tile-flipped');
	}

	get symbol() {
		return this.getAttribute('symbol');
	}

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

	get xSrc() {
		return this.getAttribute('x-src') || BoardTile.DEFAULT_X;
	}

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

	get oSrc() {
		return this.getAttribute('o-src') || BoardTile.DEFAULT_O;
	}

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

window.customElements.define('board-tile', BoardTile);