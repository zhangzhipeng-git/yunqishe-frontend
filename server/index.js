// @ts-nocheck
var Koa = require('koa')
var consola = require('consola')
var { Nuxt, Builder } = require('nuxt')
var app = new Koa();

// Import and Set Nuxt.js options
var config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start() {
    // Instantiate nuxt.js
    var nuxt = new Nuxt(config)

    var {
        host = process.env.HOST || '127.0.0.1',
            port = process.env.PORT || 3000
    } = nuxt.options.server

    // Build in development
    if (config.dev) {
        var builder = new Builder(nuxt)
        await builder.build()
    } else {
        await nuxt.ready()
    }

    app.use((ctx) => {
        ctx.status = 200
        ctx.respond = false // Bypass Koa's built-in response handling
        ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
        nuxt.render(ctx.req, ctx.res)
    })

    app.listen(port, host)
    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
    })
}

start()