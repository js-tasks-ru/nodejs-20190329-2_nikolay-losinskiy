const Koa = require('koa');
const Router = require('koa-router');
const User = require('./models/User');
const mongoose = require('mongoose');

const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

const router = new Router();

router.get('/users', async (ctx) => {
  ctx.body = await User.find({});
});

router.get('/users/:id', async (ctx) => {
  try {
    const id = ctx.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      ctx.status = 400;
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      ctx.status = 404;
      return;
    }

    ctx.body = user;
  } catch (err) {
    ctx.status = 500;
  }
});

router.patch('/users/:id', async (ctx) => {
  try {
    const id = ctx.params.id;
    ctx.body = await User.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
      runValidators: true,
    });
  } catch (err) {
    ctx.status = 400;
    ctx.body = {errors: {email: err.errors.email.message}};
  }
});

router.post('/users', async (ctx) => {
  try {
    ctx.body = await User.create(ctx.request.body);
  } catch (err) {
    ctx.status = 400;
    ctx.body = {errors: {email: err.errors.email.message}};
  }
});

router.delete('/users/:id', async (ctx) => {
  try {
    const id = ctx.params.id;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      ctx.status = 404;
      return;
    }

    ctx.status = 200;
  } catch (err) {
    ctx.status = 500;
  }
});

app.use(router.routes());

module.exports = app;
