// @ts-nocheck
const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const session = require('koa-session');
const app = new Koa()


  // cookie签名密钥，只有服务器可以解开，session是用cookie实现的
  // 每次请求都会携带cookie的sessionid，当用户禁用cookie时，可以通过
  // 自己定义sessionid（session唯一标识）提交给后台
  app.keys = ['zhangzhipeng'];
 
  // koa-session配置
  const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 2*3600*1000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
  }
  app.use(session(CONFIG, app))

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    // 为req添加cookie
    ctx.req.cookies = ctx.cookies;
    // 为res添加cookie
    ctx.res.cookies = ctx.cookies;
    // 为req添加session
    ctx.req.session = ctx.session;
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
