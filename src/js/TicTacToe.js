import Host from './Host.js';
import templ from '../html/tic-tac-toe.html';

// Import ES Modules that define custom elements used inside the <tic-tac-toe> element.
import './SWLoader.js';
import './BoardTile.js';
import './NextSymbol.js';

/**
 * Uses the `symbol` query parameter in the URL to create an array of symbols. The returned array
 * will always have a length of 9. If the `symbols` query parameter is not present in the URL, the
 * return array will have 9 `null` values. For instance if the URL contains `?symbols=xx-o--o--`,
 * this function will return: `['x', 'x', null, 'o', null, null, 'o', null, null]`
 *
 * @function parseSymbolsFromURL
 * @param {string} [search] The URL search string. Uses `window.location.search` by default.
 * @returns {string[]}
 */
export function parseSymbolsFromURL(search) {
	const searchStr = search !== undefined ? search : window.location.search;
	const params = new URLSearchParams(searchStr);
	const symbols = (params.get('symbols') || '').toLowerCase().split('').map(
		val => (val === 'x' || val === 'o' ? val : null),
	);

	while (symbols.length < 9) {
		symbols.push(null);
	}

	return symbols;
}

/**
 * Class definition for the <tic-tac-toe> custom element.
 */
export default class TicTacToe extends Host {
	/**
	 * Path to the image to use as the X symbol when the Zardoz mode is on.
	 */
	static get ZARDOZ_X() {
		return '/v{{ version }}/img/square.svg';
	}

	/**
	 * Path to the image to use as the O symbol when the Zardoz mode is on.
	 */
	static get ZARDOZ_O() {
		return '/v{{ version }}/img/zardoz01.jpg';
	}

	/**
	 * Constructor. If it exists, it parses the `symbols` query parameter from the URL. The result
	 * is assigned to `this.tiles` as an array of objects. Once rendered, `this.tiles` becomes an
	 * array of <board-tile> custom elements.
	 *
	 * @constructor
	 */
	constructor() {
		super();
		this.tiles = parseSymbolsFromURL().map(symbol => ({ symbol }));
	}

	/**
	 * This getter returns the template to use when the element is rendered.
	 */
	// eslint-disable-next-line class-methods-use-this
	get template() {
		return templ;
	}

	/**
	 * The `connectedCallback` method is overwritten here to:
	 *
	 *   * Check if there's a winner (in case the URL contains a `symbols` query parameter).
	 *   * Listen for `onpopstate` (for when the "undo" or the back browser buttons are clicked).
	 *   * Obtains all the tiles in the board and assigns the resulting array to `this.tiles`.
	 *
	 * @method connectedCallback
	 */
	connectedCallback() {
		super.connectedCallback();

		this.updateWinner();
		window.onpopstate = () => this.load();

		this.tiles = this.queryAll('board-tile');
	}

	/**
	 * Parses the `symbols` query parameter in the URL and assigns the parsed symbols to the
	 * corresponding tiles in the board. This is meant to be use as callback for the history
	 * popstate event, which is triggered when the "undo" button or the back browser button are
	 * clicked.
	 *
	 * @method load
	 */
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

	/**
	 * Checks if there's a winner and if there is, it shows the SVG overlay showing the winner.
	 *
	 * @method updateWinner
	 */
	updateWinner() {
		const winner = this.findWinner();
		const svg = this.query('.winner-indicator');

		if (winner) {
			svg.setAttribute('data-winner', winner);
		} else {
			svg.removeAttribute('data-winner');
		}
	}

	/**
	 * If there's a winner, it returns the row, column, or diagonal that won the game.
	 *
	 * @method findWinner
	 * @return {string} The winning row, column, or diagonal, or `null` if there's not winner.
	 */
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

	/**
	 * This getter determines what the next symbol is, either "x" or "o".
	 */
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

	/**
	 * Obtains all the symbols of the <board-tile> elements, checks if there's a winner, and
	 * updates the `symbols` query parameter in the URL. This is meant to be used as callback for
	 * "tile-flipped" custom events, which are dispatched by the <board-tile> custom elements.
	 *
	 * @method tileFlipped
	 */
	tileFlipped() {
		const symbols = this.tiles.map(tile => tile.symbol || '-').join('');

		this.updateWinner();

		window.history.pushState(null, '', `?symbols=${ symbols }`);
	}

	/**
	 * Reverts the previous action by going back in the browser history. This is meant to be called
	 * when the "undo" button is clicked.
	 *
	 * @method undo
	 */
	// eslint-disable-next-line class-methods-use-this
	undo(event) {
		window.history.back();

		if (event) {
			event.preventDefault();
		}
	}

	/**
	 * Restarts the game, by assigning `null` as the `symbol` of all <board-tile> elements, and
	 * pushes a new state into the browser history.
	 *
	 * @method restart
	 */
	restart() {
		this.tiles.forEach((tile) => {
			// eslint-disable-next-line no-param-reassign
			tile.symbol = null;
		});
		// Remove the SVG overlay if it was visible.
		this.updateWinner();
		window.history.pushState(null, '', '/');
		this.dispatch('symbols-loaded');
	}

	/**
	 * This getter can be used to determine if the user can go back.
	 */
	get canGoBack() {
		const tileWithSymbol = this.tiles.find(tile => tile.symbol !== null);
		return !!tileWithSymbol;
	}

	/**
	 * This setter turns on/off the Zardoz mode.
	 */
	set zardozMode(on) {
		/**
		 * If the given value is `true`, use `ZARDOZ_X` and `ZARDOZ_O` as the `xSrc` and `oSrc`
		 * properties of all the <board-tile> elements and the <next-symbol> element.
		 */
		const xSrc = on === true ? TicTacToe.ZARDOZ_X : null;
		const oSrc = on === true ? TicTacToe.ZARDOZ_O : null;
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

// Define the <tic-tac-toe> element.
window.customElements.define('tic-tac-toe', TicTacToe);