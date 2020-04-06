/*
 * @Author: your name
 * @Date: 2020-02-22 20:16:01
 * @LastEditTime: 2020-03-19 21:00:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\core\components\commons\form\sms\sms.ts
 */
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Model, Emit, Ref, Watch } from 'vue-property-decorator';

@Component
export default class SMSComponent extends Vue {
    /** v-model */
    @Model('input')
    @Prop({default: ''})
    verifycode!: string;
    /** send */
    @Prop({default: () => {return function(){}}})
    send!: Function;
    /** 验证状态0-未验证，1-验证成功，2-验证失败，3-验证超时或未发送验证码 */
    @Prop({type: Number, default: 0})
    status!: number;
    /** 统一倒计时60s */
    second: number = 60;
    /** 是否点击了发送 */
    isSend: boolean = false;
    /** input输入框 */
    @Ref('sms')
    sms: any;
    /** 计时器 */
    timer: any;
    /** 未聚焦时只读，聚焦时设为false => 解决autocomplete自动填充问题*/
    readonly: boolean = true;
    constructor() {
        super();
    }

    get verifycode$() {
        // 验证不通过或验证超时(包含未发送验证码)的时候输入置空
        if (this.status === 2 || this.status === 3) {
            return '';
        }
        return this.verifycode||'';
    }

    set verifycode$(v: string) {
        this.emitInput(v);
    }

    get placeholder() {
        if (this.status === 0) {
            return '请输入验证码';
        } else if (this.status === 2) {
            return '验证码有误';
        } else if (this.status === 3) {
            return '验证码超时或未发送';
        }
    }

    /**
     * 发射验证码
     */
    private emitInput(v: string) {
        let verifycode = v.replace(/\D/g, '');
        if (verifycode.length >= 6) {
            this.sms.blur();
        }
        if (verifycode.length > 6) {
            verifycode = verifycode.substr(0,6);
        }
        this.$emit('input', verifycode);
    }

    /**
     * iniput聚焦初始化，未验证和输入提示
     */
    public restStatus() {
        this.status = 0;
        this.readonly = false;
    }

    /** 点击发送短信 */
    public sendSMS() {
        this.restStatus();
        this.isSend = true;
        this.send();
        this.timer = setInterval(() => {
            if (this.second === 0) {
                clearInterval(this.timer);
                setTimeout(() => {this.isSend = false;this.second = 60;}, 1000);
                return;
            }
            this.second--;
        }, 1000);
    }

    destroyed() {
        clearInterval(this.timer);
    }

}