import AppDB from '../modules/db/AppDB';
import Cookie from '../modules/db/Cookie';
import AppHttp from '../modules/http/app-http';
import AppSecure from '../modules/secure/app-secure';
import LocalStorage from '../modules/db/LocalStorage';
import SessionStorage from '../modules/db/SessionStorege';
import ComponentsHandler from '../modules/components/components-handler';
import ThirdJS from '../modules/thirdJS/third-js';

/** app */
export default  class Client {

    /** app请求 */
    private http!: AppHttp;

    /** app安全 */
    private secure!: AppSecure;
    /** 组件领导者 */
    private handler!: ComponentsHandler;
    /** app全局存贮 */
    private db!: AppDB;
    /** cookie */
    private cookie!: Cookie;
    /** LocalStorage */
    private lStore!: LocalStorage;
    /** SessionStorage */
    private sStore!: SessionStorage;
    /** loadJS */
    private thirdJS!: ThirdJS;
    /** 启动任务 */
    private tasks: Function[] = [];

    private constructor() {
        if ((<any>Client).clientContext) { // 不允许重新创建上下文
            return (<any>Client).clientContext;
        }
        this.init();
    }

    private setHttp(http: AppHttp) {
        this.http = http;
    }

    private setSecure(secure: AppSecure) {
        this.secure = secure;
    }

    private setHandler(handler: ComponentsHandler) {
        this.handler = handler;
    }

    private setAppDB(db: AppDB) {
        this.db = db;
    }

    private setCookie(cookie: Cookie) {
        this.cookie = cookie;
    }

    private setSessionStorage(sStore: SessionStorage) {
        this.sStore = sStore;
    }

    private setLocalStorage(lStore: LocalStorage) {
        this.lStore = lStore;
    }
    /**
     * 获取app请求
     */
    public getHttp(): AppHttp {
        return this.http;
    }
    /**
     * 获取app安全
     */
    public getSecure(): AppSecure {
        return this.secure;
    }

    /** 获取组件领导者 */
    public getHandler(): ComponentsHandler {
        return this.handler;
    }    

    /**
     * 获取app内存存贮服务
     */
    public getDB(): AppDB {
        return this.db;
    }

    /**
     * 获取cookie服务
     */
    public getCookie(): Cookie {
        return this.cookie;
    }

    /**
     * 获取会话存贮服务
     */
    public getSessionStorage(): SessionStorage {
        return this.sStore;
    }

    /**
     * 获取本地存储服务
     */
    public getLocalStorage(): LocalStorage {
        return this.lStore;
    }

    /**
     * 获取懒加载js服务
     */
    public getThirdJS(): ThirdJS {
        return this.thirdJS;
    }

    /**
     * 设置懒加载第三方js服务
     * @param thirdJS 懒加载第三方js
     */
    public setThirdJs(thirdJS: ThirdJS): void {
        this.thirdJS = thirdJS;
    }

    private init() {
        // 设置http服务
        this.setHttp(new AppHttp());
        // 设置安全服务
        this.setSecure(new AppSecure());
        // 设置组件领导者
        this.setHandler(new ComponentsHandler());
        // 设置内存存贮服务
        this.setAppDB(new AppDB());
        // 设置cookie服务
        this.setCookie(new Cookie());
        // 设置本地存贮服务
        this.setLocalStorage(new LocalStorage());
        // 设置会话存贮服务
        this.setSessionStorage(new SessionStorage());
        // 设置懒加载第三方js服务
        this.setThirdJs(new ThirdJS());

        // 注入模块间依赖
        this.injectDendencies();
        // 启动异步任务
        setTimeout(() => {this.startUp()});
    }

    /** 添加启动任务 */
    public addTask(task: Function) {
        if ((<any>this).START_UP) {
            throw new Error('应用已启动，无法注册启动任务！');
        }
        this.tasks.push(task);
    }

    /** 客户端启动应用 */
    private startUp() {
        for (let i = 0, len = this.tasks.length; i < len; i++) {
            const task = this.tasks[i];
            task(this);
            
        }
        (<any>this).START_UP = true;
    }

    /**
     * 注入依赖
     */
    private injectDendencies(): void {
        // http模块依赖db模块和secure模块和handler模块
        this.http.setDB(this.db);
        this.http.setSecure(this.secure);
        this.http.setHandler(this.handler);
        // secure模块依赖http模块
        this.secure.setHttp(this.http);
    }

    /**
     * 得到单例app上下文，注意：前端的服务端无法保持单例，每次请求会生成新的clientContext
     * 服务端的单例要放到global上，客户端clientContext上下文相当于服务端的session
     */
    public static getClientContext() {
        if ((<any>global).clientContext) {
            return (<any>global).clientContext;
        }
        (<any>global).clientContext = new Client();
        return (<any>global).clientContext;
    }
}