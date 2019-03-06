const JSDOMEnvironment = require('jest-environment-jsdom');

class TestEnvironment extends JSDOMEnvironment {
	async setup() {
		await super.setup();
		this.global.customElements = {
			define: function() {}
		};
	}

	async teardown() {
		delete this.global.customElements;
		await super.teardown();
	}
}

module.exports = TestEnvironment;