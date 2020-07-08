import { Context } from '@nuxt/types';
import AppHttp  from '../modules/http/app-http';
import AppSecure from '../modules/secure/app-secure';
import AppDB from '../modules/db/AppDB';

export default class Server {
    /** http */
    private http!: AppHttp;
    /** 安全 */
    private secure!: AppSecure;
    /** 全局存贮 */
    private db: AppDB = new AppDB();
    /** context */
    context!: Context;
    static serverContext: Server;
    private constructor() {
        if ((<any>global).serverContext) {
            return (<any>global).serverContext;
        }
        this.init();
    }

    private init(): void {
        this.http = new AppHttp();
        this.secure = new AppSecure();

        this.injectDependencies();
    }

    /**
     * 获取node全局存贮服务
     */
    public getDB(): AppDB {
        return this.db;
    }

    /**
     * 获取http服务
     */
    public getHttp(): AppHttp {
        return this.http;
    }

    /**
     * 获取安全服务
     */
    public getSecure(): AppSecure {
        return this.secure;
    }

    /**
     * 设置两端公用的上下文
     * @param context 核心上下文
     */
    public setContext(context: Context) {
        if (!!this.context) return;
        this.context = context;
        this.setHttpAjax(context.$axios);
    }

    /**
     * 获取两端公用的上下文
     */
    public getContext(): Context {
        return this.context;
    }

    private injectDependencies(): void {
        this.http.setDB(<any>this.db);
        this.http.setSecure(this.secure);

        this.secure.setHttp(this.http);
    }

        /**
     * 设置http通讯工具
     * @param ajax ajax
     */
    private setHttpAjax(ajax: any) {
        this.http.setAjax(ajax);
    }

    /** 返回undifined，服务端不会用到公用组件管理器！！！ */
    getHandler(): any {
        return;
    }

    /**
     *获取服务端context
     */
    public static getServerContext(): Server {
        if ((<any>Server).serverContext) {
            return (<any>Server).serverContext;
        }
        (<any>Server).serverContext = new Server();
        return (<any>Server).serverContext;
    }
}
