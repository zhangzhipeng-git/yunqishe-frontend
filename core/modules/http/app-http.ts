import {Context} from '@nuxt/types';
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import {AxiosRequestConfig} from 'axios';
import AppDB from '../db/AppDB';
import AppSecure from '../secure/app-secure';
import Log, {COLORS} from '../util/log-util';
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
    private reqMap: {[url: string]: {lastTime: number}; } = {};
    constructor() {
    }

    /**
     * 设置axios
     * @param $axios nuxt内置axios
     */
    public setAxios($axios: NuxtAxiosInstance) {
        if(!!this.$axios){
            throw new Error(HTTP_ERRORS.HTTP_ERROR_02);
            return;
        }
        this.$axios = $axios;
    }
    /**
     * 获取axios
     */
    public getAxios() {
        return this.$axios;
    }

    /**
     * app仓库
     * @param db 全局存贮
     */
    public setDB(db: AppDB) {
        if(this.db){
            throw new Error(HTTP_ERRORS.HTTP_ERROR_03)
            return;
        }
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
        const mes = EncryptUtil.AESDecrypt(data, this.secure.getKey());
        console.log(mes);
        return mes;
    }

    /**
     * get请求
     * @param url  get请求url
     * @param config Axios请求配置参数
     */
    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        ///////////////debug-s//////////////////
        Log.debug('get请求', COLORS.RED);
        Log.debug(new Date().toString(), COLORS.RED)
        Log.debug('请求url:' + url, COLORS.GREEN);
        ///////////////debug-e//////////////////
        return this.$axios.get(url, config).then(data => {
            // 如果有config，则认为是axios装饰过的data，则实际响应为data.data
            if (data.config) data = data.data;
            ///////////////debug-s//////////////////
            Log.debug('响应体data:', COLORS.GREEN);
            ///////////////debug-e//////////////////
            if (data.status) { // 有status，则表明返回未加密
                ///////////////debug-s//////////////////
                Log.debug('返回未加密');
                console.log(data);
                ///////////////debug-e//////////////////
                return data;
            }
            return this.aesDecryptData(data);
        }) as Promise<T>;
    }

    /**
     * !!!要在获取公钥和上送公钥成功后调用该方法!!!
     * post请求，返回根据是否有stauts判断是否加密
     * @param url post请求url
     * @param data 请求体
     * @param config axios配置参数
     * @param needToken 是否启用防重复提交
     */
    public async post<T>(url: string, data: Object, o:{config?: AxiosRequestConfig;needToken?: boolean; throttle?: number} = {}) {
        if (!this.secure.getKey() && !this.secure.getPK()) {
           await this.secure.secureInit();
        }
        const config = o.config||{};
        const throttle = o.throttle || 1000;
        const needToken = o.needToken||false;
        config.headers = config.headers || {};
        if (throttle > 0) {
            if (!this.reqMap[url]){
                this.reqMap[url] = {lastTime: 0};
                this.reqMap[url].lastTime = Date.now();
            } else {
                const now = Date.now();
                const lastTime = this.reqMap[url].lastTime;
                if (now - lastTime < throttle) {
                    throw new Error(HTTP_ERRORS.HTTP_ERROR_04);
                }
                this.reqMap[url].lastTime = now;
            }
        }
        if (needToken) { // 防止用户重复提交表单
            const formtoken = this.db.get('formtoken') || null;
            config.headers.formtoken = formtoken;
        }
        config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        ///////////////debug-s//////////////////
        Log.debug('post请求', COLORS.RED);
        Log.debug('请求url:' + url, COLORS.GREEN);
        Log.debug('请求体:', COLORS.GREEN);
        console.log(data);
        ///////////////debug-e//////////////////
        data = EncryptUtil.AESEncrypt(data, this.secure.getKey());
        ///////////////debug-s//////////////////
        console.log('加密后：' + data);
        ///////////////debug-e//////////////////
        return this.$axios.post(url, data, config).then(data => {
            // 如果有config，则认为是axios装饰过的data，则实际响应为data.data
            if (data.config) data = data.data;
            ///////////////debug-s//////////////////
            Log.debug('响应体ata:', COLORS.GREEN);
            ///////////////debug-e//////////////////
            if (data.status) { // 有status，则表明返回未加密
                /////////////////debug-s////////////
                Log.debug('返回未加密');
                console.log(data);
                ///////////////debug-e/////////////
                return data;
            }
            return this.aesDecryptData(data);
        }) as Promise<T>;
    }

    /**
     * post请求-请求体不加密，返回根据是否有stauts判断是否加密
     * @param url post请求url
     * @param data 请求体
     * @param config axios配置参数
     * @param needToken 是否启用防重复提交
     */
    public $post<T>(url: string, data: Object, config: AxiosRequestConfig = {}, needToken: boolean = false) {
        if (arguments.length === 3 && typeof config === 'boolean')
            needToken = config;
        config.headers = config.headers || {};
        if (needToken) { // 防止用户重复提交表单
            const formtoken = this.db.get('formtoken') || null;
            config.headers.formtoken = formtoken;
        }
        config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        ///////////////debug-s//////////////////
        Log.debug('post请求', COLORS.RED);
        Log.debug('请求url:' + url, COLORS.GREEN);
        Log.debug('请求体:', COLORS.GREEN);
        console.log(data);
        ///////////////debug-e//////////////////
        return this.$axios.post(url, data, config).then(data => {
            // 如果有config，则认为是axios装饰过的data，则实际响应为data.data
            if (data.config) data = data.data;
            ///////////////debug-s//////////////////
            Log.debug('响应体ata:', COLORS.GREEN);
            ///////////////debug-e//////////////////
            if (data.status) { // 有status，则表明返回未加密
                /////////////////debug-s////////////
                Log.debug('返回未加密');
                console.log(data);
                ///////////////debug-e/////////////
                return data;
            }
            return this.aesDecryptData(data);
        }) as Promise<T>;
    }

    /**
     * 兼容客户端和node端的http请求wrapper
     * @param context Nuxt api Context
     */
    public httpRequest<T>(promise: Promise<any>, options?:{success?:Function;error?:Function},context?: Context): Promise<T> {
        if (context && process && process.server) { // server
            return promise.then(async data => {
                if (!data) {
                    context.error({statusCode: 500});
                    return data;
                }
                const status = data.status;
                const data$ = data.data?data.data:data; 
                if (data.code === 404) {
                    context.error({statusCode: 404});
                    return data;
                }
                if (status === 200 && options && options.success) {
                    await options.success(data$);
                    return data$;
                }
                if (status === 400 && options && options.error) {
                    await options.error(data$);
                    return data$;
                }
            }).catch(error => {
                const r = {statusCode:500, message: error};
                context.error(r);
                return r;
            });
        }
        // client
        return promise.then(async (data: any) => {
            if (!data) { // 没有数据返回
                this.handler.alert({
                    content: '响应失败~',
                    buttons: ['确认']
                });
                return data;
            }
            
            // 是否要走默认流程
            let result = true;
            const status = data.status;
            const data$ = data.data?data.data:data;
            
            if (status === 200) { // 成功
                if (options?.success) { // 成功回调
                    result = await options.success(data$);
                    result = result === true;
                } else { // 成功时没有success回调不走默认流程
                    result = false;
                }
            } else if (status === 400) { // 失败
                if (options?.error) { // 失败回调
                    result = await options.error(data$);
                    result = result === true;
                }
            } else { // 未知状态，算做系统错误
                this.handler.unload();
                this.handler.alert({
                    content: '系统错误，请稍后重试',
                    buttons: ['确认']
                });
                result = false;
                return data$;
            }
            // 走默认流程
            this.handler.unload();
            if(result) {
                this.handler.alert({
                    content: data.tip || '未知错误', // 外层错误提示
                    buttons: ['确认']
                })
            }
            return data$;
        }).catch(error => {
            this.handler.unload();
            this.handler.alert({
                content: '抱歉，应用出现了点小问题~',
                buttons:['确认']
            })
            throw new Error(error);
        });
    }
}