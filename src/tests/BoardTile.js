import BoardTile from '../js/BoardTile.js';

describe('symbolChanged', () => {
	test('adds the class "flipping" to the element', () => {
		const add = jest.fn();
		const tile = new BoardTile();

		tile.classList = { add };
		tile.setAttribute = jest.fn();

		tile.symbolChanged(null, 'x');

		expect(add).toHaveBeenCalled();
		expect(add.mock.calls.length).toBe(1);
		expect(add.mock.calls[0][0]).toBe('flipping');
	});

	test('sets the "flip-side-up" and "animation-symbol" attributes', () => {
		const add = jest.fn();
		const tile = new BoardTile();

		tile.classList = { add: jest.fn() };

		tile.setAttribute = jest.fn();
		tile.symbolChanged(null, 'x');

		// When flipped from front to back, only the "flip-side-up" must be changed.
		expect(tile.setAttribute).toHaveBeenCalled();
		expect(tile.setAttribute.mock.calls.length).toBe(1);
		expect(tile.setAttribute.mock.calls[0]).toEqual(['flip-side-up', 'back']);

		tile.setAttribute = jest.fn();
		tile.symbolChanged('x', null);

		// When flipped from back to front, it must set "flip-side-up" and "animation-symbol".
		expect(tile.setAttribute).toHaveBeenCalled();
		expect(tile.setAttribute.mock.calls.length).toBe(2);
		expect(tile.setAttribute.mock.calls[0]).toEqual(['flip-side-up', 'front']);
		expect(tile.setAttribute.mock.calls[1]).toEqual(['animation-symbol', 'x']);

		tile.setAttribute = jest.fn();
		tile.symbolChanged(null, 'o');

		expect(tile.setAttribute).toHaveBeenCalled();
		expect(tile.setAttribute.mock.calls.length).toBe(1);
		expect(tile.setAttribute.mock.calls[0]).toEqual(['flip-side-up', 'back']);
	});
});

describe('symbol property', () => {
	test('is null by default', () => {
		const tile = new BoardTile();

		jest.spyOn(tile, 'getAttribute');

		expect(tile.symbol).toBeNull();
		expect(tile.getAttribute).toHaveBeenCalled();
	});

	test('changing it updates the symbol attribute', () => {
		const tile = new BoardTile();

		tile.symbol = 'x';
		expect(tile.getAttribute('symbol')).toBe('x');
		tile.symbol = 'o';
		expect(tile.getAttribute('symbol')).toBe('o');
		tile.symbol = null;
		expect(tile.getAttribute('symbol')).toBeNull();
	});

	test('setting it to an invalid symbol sets the symbol attribute to null', () => {
		const tile = new BoardTile();

		tile.symbol = 'foo';
		expect(tile.getAttribute('symbol')).toBeNull();
	});
});

describe('xSrc property', () => {
	test('if not set, returns the path to the default X symbol image', () => {
		const tile = new BoardTile();

		expect(tile.xSrc).toBe(BoardTile.DEFAULT_X);
	});

	test('setting it updates the x-src attribute', () => {
		const tile = new BoardTile();
		const imageSrc = '/img/foo.svg';

		tile.xSrc = imageSrc;
		expect(tile.getAttribute('x-src')).toBe(imageSrc);

		tile.xSrc = null;
		expect(tile.hasAttribute('x-src')).toBe(false);
	});
});

describe('oSrc property', () => {
	test('if not set, returns the path to the default O symbol image', () => {
		const tile = new BoardTile();

		expect(tile.oSrc).toBe(BoardTile.DEFAULT_O);
	});

	test('setting it updates the o-src attribute', () => {
		const tile = new BoardTile();
		const imageSrc = '/img/foo.svg';

		tile.oSrc = imageSrc;
		expect(tile.getAttribute('o-src')).toBe(imageSrc);

		tile.oSrc = null;
		expect(tile.hasAttribute('o-src')).toBe(false);
	});
});