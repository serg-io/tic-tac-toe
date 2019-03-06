const Koa = require('koa');
const serve = require('koa-static');
const app = new Koa();

app.use(async (ctx, next) => {
	await next();

	if (ctx.url.indexOf('/html/') !== -1 && ctx.type === 'text/html') {
		ctx.type = 'js';
	}
});

if (process.env.NODE_ENV !== 'production') {
	app.use(serve('build/prebuild'));
}

app.use(serve('build/dist'));

app.listen(3000);