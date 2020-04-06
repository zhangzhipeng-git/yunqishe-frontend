// @ts-nocheck

const appConfig = require("@bigbigbird/mock/app.config");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const $theme_main_colors = {
    r: "#ef6ea8",
    p: "#5a06f5",
    b: "#00aeef",
    g: "#0ebd0e"
};

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
                hid: "description",
                name: "description",
                content: process.env.npm_package_description || ""
            }
        ],
        link: [
            { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
            { rel: "stylesheet", type: "text/css", href: "/css/common.css" },
            { rel: "stylesheet", type: "text/css", href: "/css/fonts/style.css" }
        ],
        htmlAttrs: {
            lang: "zh-CN",
            'data-n-head': 'yqs-v.1.0'
        },
        bodyAttrs: {
            class: "r",
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

    loading: {
        color: $theme_main_colors.r,
        failedColor: $theme_main_colors.r,
        height: "1PX",
        continuous: true
    },

    /**
     * 中间件，路由改变时调用
     */
    router: {
        middleware: "router",
        extendRoutes(routes, resolve) {
            // 根路径重定向到/protal
            let index = routes.findIndex(route => route.name === 'index');
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
    /*
     ** Build configuration
     */
    build: {
        ssr: true,
        preset: {
            autoprefixer: {}
        },
        parallel: true, // 开启多线程打包
        // analyze: true,
        // or
        // analyze: {
        //   analyzerMode: 'static'
        // }
        /*
         * You can extend webpack config here
         */
        extend(config, ctx) {
            const module = config.module;
            if (ctx.isClient) {
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
        // 去掉日志打印 - 生产环境有效
        plugins: [
            (process.env.NODE_ENV === 'production' ? new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_console: true,
                        pure_funcs: ['console.log', 'Log.debug', 'console.warn']
                    },
                    mangle: {
                        safari10: true
                    }
                },
                sourceMap: false,
                cache: true,
                parallel: true
            }) : { apply: () => {} })
        ]
    }
};