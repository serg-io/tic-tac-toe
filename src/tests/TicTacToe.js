import TicTacToe, { parseSymbolsFromURL } from '../js/TicTacToe.js';

describe('parseSymbolsFromURL', () => {
	test('returns an array with no symbols when called with an empty string', () => {
		const symbols = parseSymbolsFromURL('');
		expect(symbols).toEqual([null, null, null, null, null, null, null, null, null]);
	});

	test('parses "x" and "o" symbols', () => {
		const symbols = parseSymbolsFromURL('?symbols=xoxooxxxo');
		expect(symbols).toEqual(['x', 'o', 'x', 'o', 'o', 'x', 'x', 'x', 'o']);
	});

	test('parses dashes as null values (no symbols)', () => {
		const symbols = parseSymbolsFromURL('?symbols=x--o--x--');
		expect(symbols).toEqual(['x', null, null, 'o', null, null, 'x', null, null]);
	});

	test('parses invalid values into null (no symbol)', () => {
		const symbols = parseSymbolsFromURL('?symbols=foo-x-bar');
		expect(symbols).toEqual([null, 'o', 'o', null, 'x', null, null, null, null]);
	});

	test('fills remaining spaces with null when called with an incomplete value', () => {
		const symbols = parseSymbolsFromURL('?symbols=x-o');
		expect(symbols).toEqual(['x', null, 'o', null, null, null, null, null, null]);
	});

	test('ignores other query parameters', () => {
		const symbols = parseSymbolsFromURL('?foo=bar&symbols=x--o--x--');
		expect(symbols).toEqual(['x', null, null, 'o', null, null, 'x', null, null]);
	});
});

describe('TicTacToe', () => {
	describe('constructor', () => {
		test('creates an array of tiles', () => {
			const el = new TicTacToe();
			expect(el.tiles).toEqual([
				{ symbol: null }, { symbol: null }, { symbol: null },
				{ symbol: null }, { symbol: null }, { symbol: null },
				{ symbol: null }, { symbol: null }, { symbol: null },
			]);
		});

		describe('with a symbols parameter in the URL', () => {
			beforeAll(() => {
				window.history.replaceState(null, '', '?symbols=x--o--x--');
			});

			afterAll(() => {
				window.history.replaceState(null, '', '/');
			});

			test('parse the symbols from the URL to create the tiles array', () => {
				const ticTacToe = new TicTacToe();
				expect(ticTacToe.tiles).toEqual([
					{ symbol: 'x' }, { symbol: null }, { symbol: null },
					{ symbol: 'o' }, { symbol: null }, { symbol: null },
					{ symbol: 'x' }, { symbol: null }, { symbol: null },
				]);
			});
		});
	});

	test('nextSymbol specifies what the next symbol is', () => {
		const ticTacToe1 = new TicTacToe();
		const ticTacToe2 = new TicTacToe();

		ticTacToe2.tiles[0].symbol = 'x';

		expect(ticTacToe1.nextSymbol).toBe('x');
		expect(ticTacToe2.nextSymbol).toBe('o');
	});

	describe('findWinner', () => {
		test('returns null if there\'s no winner', () => {
			const ticTacToe = new TicTacToe();
			expect(ticTacToe.findWinner()).toBeNull();
		});

		test('finds winning rows', () => {
			const ticTacToeRow1 = new TicTacToe();
			const ticTacToeRow2 = new TicTacToe();
			const ticTacToeRow3 = new TicTacToe();

			ticTacToeRow1.tiles[0].symbol = 'x';
			ticTacToeRow1.tiles[1].symbol = 'x';
			ticTacToeRow1.tiles[2].symbol = 'x';

			ticTacToeRow2.tiles[3].symbol = 'o';
			ticTacToeRow2.tiles[4].symbol = 'o';
			ticTacToeRow2.tiles[5].symbol = 'o';

			ticTacToeRow3.tiles[6].symbol = 'x';
			ticTacToeRow3.tiles[7].symbol = 'x';
			ticTacToeRow3.tiles[8].symbol = 'x';

			expect(ticTacToeRow1.findWinner()).toBe('row1');
			expect(ticTacToeRow2.findWinner()).toBe('row2');
			expect(ticTacToeRow3.findWinner()).toBe('row3');
		});

		test('finds winning columns', () => {
			const ticTacToeColumn1 = new TicTacToe();
			const ticTacToeColumn2 = new TicTacToe();
			const ticTacToeColumn3 = new TicTacToe();

			ticTacToeColumn1.tiles[0].symbol = 'x';
			ticTacToeColumn1.tiles[3].symbol = 'x';
			ticTacToeColumn1.tiles[6].symbol = 'x';

			ticTacToeColumn2.tiles[1].symbol = 'o';
			ticTacToeColumn2.tiles[4].symbol = 'o';
			ticTacToeColumn2.tiles[7].symbol = 'o';

			ticTacToeColumn3.tiles[2].symbol = 'x';
			ticTacToeColumn3.tiles[5].symbol = 'x';
			ticTacToeColumn3.tiles[8].symbol = 'x';

			expect(ticTacToeColumn1.findWinner()).toBe('column1');
			expect(ticTacToeColumn2.findWinner()).toBe('column2');
			expect(ticTacToeColumn3.findWinner()).toBe('column3');
		});

		test('finds winning diagonals', () => {
			const ticTacToeDiagonal1 = new TicTacToe();
			const ticTacToeDiagonal2 = new TicTacToe();

			ticTacToeDiagonal1.tiles[0].symbol = 'x';
			ticTacToeDiagonal1.tiles[4].symbol = 'x';
			ticTacToeDiagonal1.tiles[8].symbol = 'x';

			ticTacToeDiagonal2.tiles[6].symbol = 'o';
			ticTacToeDiagonal2.tiles[4].symbol = 'o';
			ticTacToeDiagonal2.tiles[2].symbol = 'o';

			expect(ticTacToeDiagonal1.findWinner()).toBe('diagonal1');
			expect(ticTacToeDiagonal2.findWinner()).toBe('diagonal2');
		});
	});

	describe('undo', () => {
		beforeEach(() => {
			window.history.pushState(null, '', '?symbols=x--o--x--');
		});

		test('calls the window.history.back function', () => {
			const ticTacToe = new TicTacToe();
			const back = jest.spyOn(window.history, 'back');

			ticTacToe.undo();

			expect(back).toHaveBeenCalled();

			back.mockRestore();
		});

		test('prevents the event\'s default action', () => {
			const mockFn = jest.fn();
			const ticTacToe = new TicTacToe();

			ticTacToe.undo({ preventDefault: mockFn });
			expect(mockFn).toHaveBeenCalled();
		});
	});

	describe('tileFiled', () => {
		afterEach(() => {
			window.history.back();
		});

		test('calls updateWinner', () => {
			const ticTacToe = new TicTacToe();

			ticTacToe.updateWinner = jest.fn();
			ticTacToe.tileFlipped();

			expect(ticTacToe.updateWinner).toHaveBeenCalled();
		});

		test('pushes a new symbols URL parameter into the browser\'s history', () => {
			const ticTacToe = new TicTacToe();
			const pushState = jest.spyOn(window.history, 'pushState');

			ticTacToe.tiles[0].symbol = 'x';
			ticTacToe.tiles[3].symbol = 'o';
			ticTacToe.tiles[6].symbol = 'x';
			ticTacToe.updateWinner = jest.fn();

			ticTacToe.tileFlipped();

			expect(pushState).toHaveBeenCalled();
			expect(pushState.mock.calls.length).toBe(1);
			expect(pushState.mock.calls[0][2]).toBe('?symbols=x--o--x--');

			pushState.mockRestore();
		});
	});

	describe('restart', () => {
		let ticTacToe;

		beforeEach(() => {
			ticTacToe = new TicTacToe();

			ticTacToe.tiles[0].symbol = 'x';
			ticTacToe.tiles[3].symbol = 'o';
			ticTacToe.tiles[6].symbol = 'x';

			ticTacToe.dispatch = jest.fn();
			ticTacToe.updateWinner = jest.fn();
		});

		afterEach(() => {
			window.history.back();
		});

		test('clears all symbols', () => {
			ticTacToe.restart();

			expect(ticTacToe.tiles).toEqual([
				{ symbol: null }, { symbol: null }, { symbol: null },
				{ symbol: null }, { symbol: null }, { symbol: null },
				{ symbol: null }, { symbol: null }, { symbol: null },
			]);
		});

		test('calls updateWinner', () => {
			ticTacToe.restart();

			expect(ticTacToe.updateWinner).toHaveBeenCalled();
		});

		test('pushes a new state, with no symbols URL parameter, into the history', () => {
			const pushState = jest.spyOn(window.history, 'pushState');

			ticTacToe.restart();

			expect(pushState).toHaveBeenCalled();

			pushState.mockRestore();
		});

		test('dispatches a "symbols-loaded" custom event', () => {
			ticTacToe.restart();

			expect(ticTacToe.dispatch.mock.calls.length).toBe(1);
			expect(ticTacToe.dispatch.mock.calls[0][0]).toBe('symbols-loaded');
		});
	});

	describe('canGoBack', () => {
		test('is false when there are no symbols selected', () => {
			const ticTacToe = new TicTacToe();

			expect(ticTacToe.canGoBack).toBe(false);
		});

		test('is true when there is at least on symbol selected', () => {
			const ticTacToe = new TicTacToe();

			ticTacToe.tiles[0].symbol = 'x';
			expect(ticTacToe.canGoBack).toBe(true);
		});
	});
});