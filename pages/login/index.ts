/*
* Filename: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\pages\login\index.ts
* Path: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
* Created Date: Wednesday, January 22nd 2020, 9:54:38 pm
* Author: zzp-dog
* 登录注册页 
* Copyright (c) 2020 Your Company
*/

import Component from 'vue-class-component';
import BaseComponent from '@/core/base-component';
import EncryptUtil from '~/core/modules/util/encrypt-util';
import SMSComponent from '@/core/modules/components/commons/form/sms/sms';
import ButtonComponent from '@/core/modules/components/commons/form/button/button';
@Component({
    layout:'app',
    components: {
        SMSComponent,
        ButtonComponent
    }
})
export default class LoginComponent extends BaseComponent {
    
    /** 登录或注册 */
    type: string = 'login';
    /** 验证方式 */
    vtype: string = 'email';
    /** 账号 */
    account: string = '';
    /** 密码 */
    password: string = '';
    // 注册部分
    /** 密码确认 */
    repassword: string = '';
    /** 邮箱或手机号 */
    vTypeValue: string = '';
    /** 验证码 */
    verifycode: string = '';
    /** 是否通过验证 */
    isVerify: boolean = false;
    /** redirect前的路由地址 */
    fromPath: string = '';
    /** 登陆成功后默认去的url */
    static DEFAULT_PASS = '/protal';
    /** 验证码状态 */
    status: number = 0;  
    /** 按钮是否禁用 */
    get isDisabled() {
        if (this.type === 'login') {
            return !(this.account && this.password);
        }
        return !(this.account && this.password && this.repassword && this.vTypeValue && this.isVerify);
    }
    constructor() {
        super();
    }

    activated() {
        // 获取redirect的来源地址
        let fromPath = <any>this.$route.query.fromPath;
        if (fromPath === undefined || fromPath === '/login'){
            fromPath = '/protal';
        }
        this.fromPath = fromPath;
        // 安全服务 => 获取公钥，上送密钥
        this.secure.secureInit(true);
    }

    /**
     * 登录或注册
     * @param type 登录或注册
     */
    public switchType(type: string) {
        this.type = type;
    }

    /**
     * 发送验证码
     */
    public sendSMS() {
        this.httpRequest(this.http.post('/user/sendcode',this.vTypeValue));
    }

    /** 验证码达到6位后调用该函数 */
    public recieveInput(code: any) {
        if (code.length === 6) {
            this.httpRequest(this.http.post('/user/verifycode',code), {
                success: (data: any) => {
                    this.status = data.status;
                    if (this.status === 1) {
                        this.isVerify = true;
                    }
                }
            });
        }
    }

    /**
     * 登录或注册
     */
    public async doLoginOrRegist() {
        if (this.type === 'login') {
            // 登录
            this.httpRequest(this.http.post('/user/login', {
                account: this.account,
                password: await EncryptUtil.MD5(this.password)
            }), {
                success: (data: any) => {
                    this.pass(data.user);      
                }
            });
        } else if (this.type === 'regis') {
            // 注册
            this.httpRequest(this.http.post('/user/regist', {
                email: this.vTypeValue,           
                account: this.account,
                password: await EncryptUtil.MD5(this.password)
            }), {
                success: (data: any) => {
                    this.pass(data.user);
                }
            })
        }
    }
    
    /**
     * 登录成功放行
     */
    public pass(user: any):void {
        this.$store.commit('setUser', user);
        // 解码
        this.$router.push({path:decodeURIComponent(this.fromPath)});      
    }
}