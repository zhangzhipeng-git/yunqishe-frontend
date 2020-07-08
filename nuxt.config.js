// @ts-nocheck

const appConfig = require("@bigbigbird/mock/app.config");
module.exports = {
    mode: "universal",
    /*
     ** Headers of the page
     */
    head: {
        title: process.env.npm_package_name || "",
        meta: [
            { charset: "utf-8" },
            // { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            {
                name: "render",
                content: "webkit"
            },
            {
                'http-equiv': "X-UA-Compatible",
                content: "IE=edge"
            },
            {
                name: 'referrer',
                content: 'no-referrer'
            },
            {
                name: 'referrer',
                content: 'never'
            }
        ],
        link: [
            { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
            { rel: "stylesheet", type: "text/css", href: "/css/common.css" },
            { rel: "stylesheet", type: "text/css", href: "/css/fonts/style.css" },
            { rel: "stylesheet", type: "text/css", href: "https://cdn.bootcss.com/highlight.js/9.18.1/styles/a11y-light.min.css" }
        ],
        script: [
            { src: "https://cdn.bootcss.com/js-xss/0.3.3/xss.js" }
        ],
        htmlAttrs: {
            lang: "zh-CN",
            'data-n-head': 'yqs-v.1.0'
        },
        bodyAttrs: {
            class: "d",
            env: process.env.NODE_ENV,
            'data-n-head': '1029512956'
        }
    },
    /*
     ** Global CSS
     */
    css: ["~/assets/sass/app.scss"],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: ["@nuxt/typescript-build"],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        "@nuxtjs/axios",
        "@nuxtjs/proxy",
        "@nuxtjs/style-resources"
    ],
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {
        proxy: true,
        prefix: "/api", // 自动给接口加上前缀
        credentials: true
    },

    /**
     * 配置代理转发
     */
    proxy: {
        // 本地接口
        "/api/local": {
            target: "http://localhost:4201",
            changeOrigin: true,
            pathRewrite: {
                "^/api": "" // 重写前缀
            }
        },
        // 后台接口
        "/api": {
            target: "http://localhost:8080",
            changeOrigin: true,
            pathRewrite: {
                "^/api": "" // 取消前缀
            }
        }
    },

    /**
     * 在页面中注入一些变量，mixin及继承类，而不必每次都导入它们，
     * 它们总是会在每个scss(排除文件本身)中自动导入，并且是在最前面进行导入！！
     */
    styleResources: {
        scss: ["./core/assets/sass/_zx.scss"]
    },

    loading: false,

    /**
     * 中间件，路由改变时调用
     */
    router: {
        middleware: "router",
        extendRoutes(routes, resolve) {
            // 根路径重定向到/protal
            let index = routes.findIndex(route => route.path === '/');
            routes[index] = {
                ...routes[index],
                redirect: '/protal'
            }
        }
    },
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        // 两端公用的插件初始化，注入nuxt $axios到http服务中
        '@plugins/init',
        // $axios拦截
        { src: "@plugins/client/axios", mode: 'client' },
        // 移动端自动缩放
        { src: "@plugins/client/viewport", mode: 'client' },
        // 移动端eruda调试
        { src: "@plugins/client/mb-test", mode: 'client' },
        // 打印
        { src: "@plugins/client/say", mode: 'client' },
    ],
    /**
     * 环境变量，客户端也可以拿
     */
    env: {
        isDev: process.env.NODE_ENV === 'development'
    },
    typescript: {
        typeCheck: true,
        ignoreNotFoundWarnings: true
    },
    // 生产环境压缩css
    optimizeCSS: process.env.NODE_ENV === 'production' ? true : false,
    /*
     ** Build configuration
     */
    build: {
        ssr: true,
        analyze: true,
        preset: {
            autoprefixer: {}
        },
        parallel: true, // 开启多线程打包
        /*
         * You can extend webpack config here
         */
        extend(config, ctx) {
            const module = config.module;
            if (ctx.isClient && ctx.isDev) {
                config.devtool = "eval-source-map";
            }
            module.rules.push({
                test: /\.ts$/,
                exclude: ["/node_modules/", "/vendor/", "/.nuxt/"],
                loader: "ts-loader",
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                    transpileOnly: true
                }
            });
        },
        // 生产环境有效,在默认配置上加上去除console
        terser: {
            terserOptions: {
                compress: {
                    pure_funcs: ["console.log", "Log.debug"]
                }
            }
        }
    }
};