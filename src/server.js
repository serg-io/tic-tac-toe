const Koa = require('koa');
const serve = require('koa-static');
const app = new Koa();

app.use(async (ctx, next) => {
	await next();

	if (ctx.url.startsWith('/html/') && ctx.type === 'text/html') {
		ctx.type = 'js';
	}
});

app.use(serve('build/dist'));

app.use(serve('src'));

app.listen(3000);