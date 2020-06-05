const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  const answer = await createNewPromise();
  ctx.status = 200;
  ctx.body = answer;
  return next();
});

function createNewPromise() {
  return new Promise((resolve) => {
    router.post('/publish', async (ctx, next) => {
      const {message} = ctx.request.body;
      if (message) {
        ctx.status = 200;
        ctx.body = message;
        resolve(message);
        return next();
      }
    });
  });
};

app.use(router.routes());

module.exports = app;
