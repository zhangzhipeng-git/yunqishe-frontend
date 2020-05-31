
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { AxiosRequestConfig } from 'axios';
import AppDB from '../db/AppDB';
import AppSecure from '../secure/app-secure';
import Log, { COLORS } from '../util/log-util';
import EncryptUtil from '../util/encrypt-util';
import ComponentsHandler from '../components/components-handler';

export enum HTTP_ERRORS {
    HTTP_ERROR_01 = '未协商密钥，不可调用该方法',
    HTTP_ERROR_02 = '不允许重复设置ajax服务',
    HTTP_ERROR_03 = '不允许重复设置全局存储db服务',
    HTTP_ERROR_04 = "请求太过频繁，请稍后重试"
}

export default class AppHttp {
    /** app仓储 */
    private db!: AppDB;
    /** app安全 */
    private secure!: AppSecure;
    /** axios */
    private $axios!: NuxtAxiosInstance;
    /** 组件领导者 */
    private handler!: ComponentsHandler;
    /** 请求map */
    private reqMap: { [url: string]: { lastTime: number }; } = {};
    constructor() {
    }

    /**
     * 设置axios
     * @param $axios nuxt内置axios
     */
    public setAjax($axios: NuxtAxiosInstance) {
        if (!!this.$axios) {
            return;
        }
        this.$axios = $axios;
    }
    /**
     * 获取axios
     */
    public getAjax() {
        return this.$axios;
    }

    /**
     * app仓库
     * @param db 全局存贮
     */
    public setDB(db: AppDB) {
        if (this.db) {return;}
        this.db = db;
    }

    /**
     * 设置安全服务
     * @param secure 安全服务
     */
    public setSecure(secure: AppSecure) {
        this.secure = secure;
    }

    /**
     * 设置handler
     * @param handler 组件领导者实例
     */
    public setHandler(handler: ComponentsHandler) {
        this.handler = handler;
    }

    /**
     * 公用解密
     * @param data 密文
     */
    private aesDecryptData(data: any) {
        console.log('解密后:');
        return EncryptUtil.AESDecrypt(data, this.secure.getKey());
    }

    /**
     * get请求
     * @param url  get请求url
     * @param config Axios请求配置参数
     */
    public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        Log.debug('get请求', COLORS.RED);
        Log.debug(new Date().toString(), COLORS.RED)
        Log.debug('请求url:' + url, COLORS.GREEN);
        return new Promise((res: any) => {
            this.$axios.get(url, config).then(data => {
                // 如果有config，则认为是axios装饰过的data，则实际响应为data.data
                if (data.config) data = data.data;
                Log.debug('响应体data:', COLORS.GREEN);
                if (data.status) { // 有status，则表明返回未加密
                    Log.debug('返回未加密');
                    console.log(data);
                    res(data);
                    return;
                }
                EncryptUtil.AESDecrypt(<any>data, this.secure.getKey()).then(mes => {
                    console.log('解密后：');
                    console.log(mes);
                    res(mes);
                });
            })
        });
    }

    /**
     * !!!要在获取公钥和上送公钥成功后调用该方法!!!
     * post请求，返回根据是否有stauts判断是否加密
     * @param url post请求url
     * @param data 请求体
     * @param config axios配置参数
     * @param needToken 是否启用防重复提交
     */
    public post<T>(url: string, data: Object, o: { config?: AxiosRequestConfig; needToken?: boolean; throttle?: number } = {}): Promise<T> {
        return new Promise((res, rej) => {
            this.secure.secureInit().then(() => {
                const config = o.config || {};
                const throttle = o.throttle || 0;
                const needToken = o.needToken || false;
                config.headers = config.headers || {};
                if (throttle > 0) {
                    if (!this.reqMap[url]) {
                        this.reqMap[url] = { lastTime: 0 };
                        this.reqMap[url].lastTime = Date.now();
                    } else {
                        const now = Date.now();
                        const lastTime = this.reqMap[url].lastTime;
                        if (now - lastTime < throttle) {
                            rej(new Error(HTTP_ERRORS.HTTP_ERROR_04));
                        }
                        this.reqMap[url].lastTime = now;
                    }
                }
                if (needToken) { // 防止用户重复提交表单
                    const formtoken = this.db.get('formtoken') || null;
                    config.headers.formtoken = formtoken;
                }
                config.headers['Content-Type'] = 'application/json;charset=UTF-8';
                Log.debug('post请求', COLORS.RED);
                Log.debug('请求url:' + url, COLORS.GREEN);
                Log.debug('请求体:', COLORS.GREEN);
                console.log(data);
                EncryptUtil.AESEncrypt(data, this.secure.getKey()).then(data => {
                    console.log('加密后：' + data);
                    this.$axios.post(url, data, config).then(data => {
                        // 如果有config，则认为是axios装饰过的data，则实际响应为data.data
                        if (data.config) data = data.data;
                        Log.debug('响应体ata:', COLORS.GREEN);
                        if (data.status) { // 有status，则表明返回未加密
                            Log.debug('返回未加密');
                            console.log(data);
                            res(<any>data);
                            return;
                        }
                        EncryptUtil.AESDecrypt(<any>data, this.secure.getKey()).then(mes => {
                            console.log('解密后：');
                            console.log(mes);
                            res(<any>mes);
                        });
                    })
                });
            });
        })
    }

    /**
     * post请求-请求体不加密，返回根据是否有stauts判断是否加密
     * @param url post请求url
     * @param data 请求体
     * @param config axios配置参数
     * @param needToken 是否启用防重复提交
     */
    public $post<T>(url: string, data: Object, o: { config?: AxiosRequestConfig; needToken?: boolean; throttle?: number } = {}): Promise<T> {
        return new Promise((res, rej) => {
            const config = o.config || {};
            const throttle = o.throttle || 0;
            const needToken = o.needToken || false;
            config.headers = config.headers || {};
            if (throttle > 0) {
                if (!this.reqMap[url]) {
                    this.reqMap[url] = { lastTime: 0 };
                    this.reqMap[url].lastTime = Date.now();
                } else {
                    const now = Date.now();
                    const lastTime = this.reqMap[url].lastTime;
                    if (now - lastTime < throttle) {
                        rej(new Error(HTTP_ERRORS.HTTP_ERROR_04));
                    }
                    this.reqMap[url].lastTime = now;
                }
            }
            if (needToken) { // 防止用户重复提交表单
                const formtoken = this.db.get('formtoken') || null;
                config.headers.formtoken = formtoken;
            }
            config.headers['Content-Type'] = config.headers['Content-Type']||'application/json;charset=UTF-8';
            Log.debug('post请求', COLORS.RED);
            Log.debug('请求url:' + url, COLORS.GREEN);
            Log.debug('请求体:', COLORS.GREEN);
            console.log(data);
            this.$axios.post(url, data, config).then(data => {
                // 如果有config，则认为是axios装饰过的data，则实际响应为data.data
                if (data.config) data = data.data;
                Log.debug('响应体ata:', COLORS.GREEN);
                if (data.status) { // 有status，则表明返回未加密
                    Log.debug('返回未加密');
                    console.log(data);
                    res(<any>data);
                    return;
                }
                EncryptUtil.AESDecrypt(<any>data, this.secure.getKey()).then(mes => {
                    console.log('解密后：');
                    console.log(mes);
                    res(<any>mes);
                });
            });
        })
    }
}