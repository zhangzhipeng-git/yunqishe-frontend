/*
* Filename: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\pages\login\index.ts
* Path: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
* Created Date: Wednesday, January 22nd 2020, 9:54:38 pm
* Author: zzp-dog
* 登录安装页 
* Copyright (c) 2020 Your Company
*/

import { Context } from '@nuxt/types';
import Component from 'vue-class-component';
import BaseComponent from '@/core/base-component.ts';
import EncryptUtil from '~/core/modules/util/encrypt-util.ts';
import SMSComponent from '@/core/modules/components/commons/form/sms/sms';
import ButtonComponent from '@/core/modules/components/commons/form/button/button';
import App from '~/core/context/app-context';
@Component({
    layout:'default',
    components: {
        SMSComponent,
        ButtonComponent
    },
    async asyncData(context:  Context) {
        let type;
        const http = App.getAppContext().getHttp();
        await http.httpRequest(http.get('/user/queryadmin'), {
            success: () => {
                type = 'install';
            },
            error: () => {
                type = 'login';
            }
        },context);
        return {type};
    }
})
export default class LogForSysComponent extends BaseComponent {
    
    /** 登录或安装 */
    type: string = 'login';
    /** 验证方式 */
    vtype: string = 'email';
    /** 账号 */
    account: string = '';
    /** 密码 */
    password: string = '';

    // 安装部分
    /** 密码确认 */
    repassword: string = '';
    /** 邮箱或手机号 */
    vTypeValue: string = '';
    /** 验证码 */
    verifycode: string = '';
    /** 按钮是否可点击 */
    disabled: boolean = true;
    /** 是否通过验证 */
    isVerify: boolean = false;
    /** redirect前的路由地址 */
    fromPath: string = '';
    /** 登陆成功后默认去的url */
    static DEFAULT_PASS = '/protal';
    /** 验证码验证状态 */
    status: number = 0;
    constructor() {
        super();
    }

    public beforeMount() {
        // 获取redirect的来源地址
        this.fromPath = <any>this.$route.query.fromPath;
        // 安全服务 => 获取公钥，上送密钥
        this.secure.secureInit();
    }

    /**
     * 发送验证码
     */
    public sendSMS() {
        this.httpRequest(this.http.post('/user/sendcode',this.vTypeValue));
    }

    /** 验证码达到6位后调用该函数 */
    public recieveInput(code: string) {
        if (code.length === 6) {
            this.handler.load();
            this.httpRequest(this.http.post('/user/verifycode', this.verifycode), {
                success: (data: any) => {
                    this.status = data.status;
                    if (this.status === 1) {
                        this.isVerify = true;
                        this.isDisabled();
                    }
                }
            });
        }
    }

    /**
     * 登录或安装
     */
    public doLoginOrInstall() {
        if (this.type === 'login') {
            // 登录
            this.httpRequest(this.http.post('/user/login', {
                account: this.account,
                password: EncryptUtil.MD5(this.password)
            }), {
                success: (data: any) => {
                    this.pass(data.user);           
                }
            });
        } else if (this.type === 'install') {
            // 安装
            this.httpRequest(this.http.post('user/install', {
                email: this.vTypeValue,           
                account: this.account,
                password: EncryptUtil.MD5(this.password)
            }), {
                success: (data: any) => {
                    this.pass(data.user);
                }
            })
        }
    }

    /**
     * 按钮是否禁用
     */
    public isDisabled(): void {
        if (this.type === 'login') {
            this.disabled = !(this.account && this.password);
        } else {
            this.disabled = !(this.account && this.password && this.repassword && this.vTypeValue && this.isVerify);
        }
    }
    
    /**
     * 登录成功放行
     */
    public pass(user: any):void {
        this.db.set('user', user);
        let path = !!this.fromPath? this.fromPath : '/admin';
        this.$store.commit('setUser', user);
        this.$router.push({path});         
    }

}