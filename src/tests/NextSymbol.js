import NextSymbol from '../js/NextSymbol.js';

describe('symbolChanged', () => {
	test('it updates the xTileClass and oTileClass properties', () => {
		const nextSymbol = new NextSymbol();

		nextSymbol.dispatch = jest.fn();

		expect(nextSymbol.xTileClass).toBeFalsy();
		expect(nextSymbol.oTileClass).toBeFalsy();

		nextSymbol.symbolChanged(null, 'x');
		expect(nextSymbol.xTileClass).toBe('raise');

		nextSymbol.symbolChanged('x', 'o');
		expect(nextSymbol.xTileClass).toBe('lower');
		expect(nextSymbol.oTileClass).toBe('raise');

		nextSymbol.symbolChanged('o', 'x');
		expect(nextSymbol.xTileClass).toBe('raise');
		expect(nextSymbol.oTileClass).toBe('lower');
	});

	test('dispatches a "symbol-changed" custom event that doesn\'t bubble up', () => {
		const nextSymbol = new NextSymbol();

		nextSymbol.dispatch = jest.fn();

		nextSymbol.symbolChanged(null, 'x');
		expect(nextSymbol.dispatch).toHaveBeenCalled();
		expect(nextSymbol.dispatch.mock.calls.length).toBe(1);

		const { type, bubbles } = nextSymbol.dispatch.mock.calls[0][0];

		expect(type).toBe('symbol-changed');
		expect(bubbles).toBe(false);
	});
});