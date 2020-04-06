import AppHttp  from '../modules/http/app-http';
import AppSecure from '../modules/secure/app-secure';
export default class Server {
    http!: AppHttp;
    secure!: AppSecure;
    db: Map<string, Object> = new Map();
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
    public getDB(): Map<string, Object> {
        return this.db;
    }

    private setHttp(http: AppHttp): void {
        this.http = http;
    }
    /**
     * 获取http服务
     */
    public getHttp(): AppHttp {
        return this.http;
    }

    private setSecure(secure: AppSecure): void {
        this.secure = secure;
    }
    /**
     * 获取安全服务
     */
    public getSecure(): AppSecure {
        return this.secure;
    }

    private injectDependencies(): void {
        this.http.setDB(<any>this.db);
        this.http.setSecure(this.secure);

        this.secure.setHttp(this.http);
    }

    /**
     *获取服务端context
     */
    public static getServerContext(): Server {
        if ((<any>global).serverContext) {
            return (<any>global).serverContext;
        }
        (<any>global).serverContext = new Server();
        return (<any>global).serverContext;
    }
}