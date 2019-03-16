import SWLoader from '../js/SWLoader.js';

test('calling show adds the "fade-in" class', () => {
	const el = new SWLoader();

	el.show();

	expect(el.classList.contains('fade-in')).toBe(true);
	expect(el.classList.contains('fade-out')).toBe(false);
});

test('calling hide adds the "fade-out" class', () => {
	const el = new SWLoader();

	el.hide();

	expect(el.classList.contains('fade-out')).toBe(true);
	expect(el.classList.contains('fade-int')).toBe(false);
});