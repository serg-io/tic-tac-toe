import Host from './Host.js';
import templ from '../html/tic-tac-toe.html';

import './BoardTile.js';
import './NextSymbol.js';

const ZARDOZ_X = '/img/square.svg';
const ZARDOZ_O = '/img/zardoz01.png';

// TODO: Is a polyfill needed?
export function parseSymbolsFromURL() {
	const params = new URLSearchParams(window.location.search);
	const symbols = (params.get('symbols') || '').toLowerCase().split('').map(
		val => (val === 'x' || val === 'o' ? val : null),
	);

	while (symbols.length < 9) {
		symbols.push(null);
	}

	return symbols;
}

export default class TicTacToe extends Host {
	constructor() {
		super();
		this.tiles = parseSymbolsFromURL().map(symbol => ({ symbol }));
	}

	// eslint-disable-next-line class-methods-use-this
	get template() {
		return templ;
	}

	connectedCallback() {
		super.connectedCallback();

		this.updateWinner();
		window.onpopstate = () => this.load();

		this.tiles = this.queryAll('board-tile');
	}

	load() {
		const symbols = parseSymbolsFromURL();

		symbols.forEach((symbol, i) => {
			const tile = this.tiles[i];

			if (tile.symbol !== symbol) {
				tile.symbol = symbol;
			}
		});

		this.dispatch('symbols-loaded');
		this.updateWinner();
	}

	updateWinner() {
		const winner = this.findWinner();
		const svg = this.query('.winner-indicator');

		if (winner) {
			svg.setAttribute('data-winner', winner);
		} else {
			svg.removeAttribute('data-winner');
		}
	}

	findWinner() {
		const symbols = this.tiles.map(tile => tile.symbol);

		for (let i = 0; i < 3; i++) {
			const j = i * 3;

			if (symbols[j] && symbols[j] === symbols[j + 1] && symbols[j] === symbols[j + 2]) {
				return `row${ i + 1 }`;
			}

			if (symbols[i] && symbols[i] === symbols[i + 3] && symbols[i] === symbols[i + 6]) {
				return `column${ i + 1 }`;
			}
		}

		if (symbols[0] && symbols[0] === symbols[4] && symbols[0] === symbols[8]) {
			return 'diagonal1';
		}

		if (symbols[6] && symbols[6] === symbols[4] && symbols[6] === symbols[2]) {
			return 'diagonal2';
		}

		return null;
	}

	get nextSymbol() {
		let exes = 0;
		let os = 0;

		this.tiles.forEach(({ symbol }) => {
			if (symbol === 'x') {
				exes++;
			} else if (symbol === 'o') {
				os++;
			}
		});

		return exes > os ? 'o' : 'x';
	}

	tileFlipped() {
		const symbols = this.tiles.map(tile => tile.symbol || '-').join('');

		this.updateWinner();

		window.history.pushState(null, '', `?symbols=${ symbols }`);
	}

	// eslint-disable-next-line class-methods-use-this
	undo(event) {
		window.history.back();

		if (event) {
			event.preventDefault();
		}
	}

	restart() {
		this.tiles.forEach((tile) => {
			// eslint-disable-next-line no-param-reassign
			tile.symbol = null;
		});
		this.updateWinner();
		window.history.pushState(null, '', '/');
		this.dispatch('symbols-loaded');
	}

	get canGoBack() {
		const tileWithSymbol = this.tiles.find(tile => tile.symbol !== null);
		return !!tileWithSymbol;
	}

	set zardozMode(on) {
		const xSrc = on ? ZARDOZ_X : null;
		const oSrc = on ? ZARDOZ_O : null;
		const nextSymbolEl = this.query('next-symbol');
		const tiles = [nextSymbolEl, ...this.tiles];

		tiles.forEach((el) => {
			/* eslint-disable no-param-reassign */
			el.xSrc = xSrc;
			el.oSrc = oSrc;
			/* eslint-enable no-param-reassign */
		});
	}
}

window.customElements.define('tic-tac-toe', TicTacToe);