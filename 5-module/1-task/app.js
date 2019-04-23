const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let clients = [];

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await new Promise((resolve) => {
    clients.push(resolve);
  });
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message) {
    return;
  }

  clients.forEach((resolve) => {
    resolve(message);
  });
  clients = [];
  ctx.body = 'success';
});

app.use(router.routes());

module.exports = app;
