import { COLORS } from '../util/log-util';
import AppHttp from '../http/app-http';
import Generator from '../util/generator-util';
import EncryptUtil from '../util/encrypt-util';
import Log from '../util/log-util';
export default class AppSecure {
    /** 给AES密钥加密的公钥 */
    private pk!: string;
    /** AES密钥，此处采用AES-128-CBC，16个字节，128位 */
    private sk!: string;
    /** 会话id */
    private sessionid!: string;
    /** http服务 */
    private http!: AppHttp;
    /** 请求公钥的api接口 */
    private static get_pk_api: string = '/security/getpk';
    /** 上送密钥的api */
    private static send_sk_api: string = '/security/sendsk';
    /** 生成sk的字典 */
    static DICT: String = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    /** 安全服务请求流程是否完成,默认true-已完成 */
    private static isOver = true;

    constructor() {
        this.setSessionid(Generator.getUUID());
    }

    /**
     * 设置http服务
     * @param http http服务
     */
    public setHttp(http: AppHttp): void {
        if (this.http) {
            console.log('不允许重复设置http服务');
            return;
        }
        this.http = http;
    }

    /**
     * 设置请求公钥api
     * @param api 请求公钥api
     */
    public setGetPkApi(api: string) {
        AppSecure.get_pk_api = api;
    }

    /**
     * 设置上送密钥api
     * @param api 上送密钥api
     */
    public setSendSkApi(api: string) {
        AppSecure.send_sk_api = api;
    }

    /**
     * 协商密钥-请求公钥并上送密钥,且控制只执行一次！！！
     * 阻断后续axios中的拦截器执行
     * @param {boolean} isForce ? 是否强制重新上送密钥
     */
    public async secureInit(isForce: boolean = false): Promise<any> {
        if (this.pk && this.sk&&!isForce) {
            return;
        }
        if (!AppSecure.isOver&&!isForce) return;
        AppSecure.isOver = false;
        // 捕获异常
        try{
            await this.requestSecurityPK();
            await this.sendSecuritySK().then(() => {
                AppSecure.isOver = true;
            });
        } catch(e) {
            e = <Error>e;
            alert('密钥协商失败~');
        }
    }

    /**
     * 获取RSA公钥
     */
    public requestSecurityPK(): Promise<string> {
        return this.http.get<string>(AppSecure.get_pk_api).then(data => {
            if ((<any>data).status === 400) {
                throw new Error();
            }
            this.pk = (<any>data).data.pk;
            return this.pk;
        });
    }

    /**
     * 上送AES私钥
     */
    public sendSecuritySK(): Promise<any> {
        this.genAESKey();
        return new Promise(res => {
            EncryptUtil.RSAEncrypt(this.sk, this.pk, true).then(sk => {
                Log.debug('上送密钥', COLORS.GREEN);
                console.log(this.getKey());
                // 后端用json格式接受，否则接收到的私钥/会变成%
                this.http.$post(
                    AppSecure.send_sk_api,
                    sk
                ).then(data => {
                    if ((<any>data).status === 400) {
                        throw new Error();
                    }
                    res();
                });
            });
        })
    }


    /**
     * 设置私钥，调用该方法生成
     */
    public setKey(): void {
        this.genAESKey();
    }


    /**
     * 获取AES密钥
     */
    public getKey(): string {
        return this.sk;
    }

    /**
     * 获取公钥
     */
    public getPK(): string {
        return this.pk;
    }

    /**
     * 设置公钥
     */
    public setPK(pk: string) {
        this.pk = this.pk;
    }

    /**
     * @param sid 设置会话id
     */
    public setSessionid(sid: string) {
        this.sessionid = sid;
    }

    /**
     * 获取sessionid
     */
    public getSessionid(): string {
        return this.sessionid;
    }

    /**
     * 生成AES密钥
     * @param len 密钥长度默认16
     */
    private genAESKey(len: number = 16) {
        let sk = '';
        const min = 0;
        const max = AppSecure.DICT.length - 1;
        const random = Math.random;
        const range = max - min;
        for (let i = 0; i < len; i++) {
            sk += AppSecure.DICT.charAt(min + ~~(random() * range));
        }
        return this.sk = sk;
    }

}
