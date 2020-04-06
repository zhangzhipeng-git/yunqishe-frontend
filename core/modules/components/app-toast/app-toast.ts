
/*
 * @Author: your name
 * @Date: 2020-01-02 18:33:55
 * @LastEditTime : 2020-01-09 20:17:27
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\components\commons\alert\tip\tip.ts
 */
import Vue, {ComponentOptions} from 'vue';
import Component from 'vue-class-component';

@Component
export default class ToastComponent extends Vue {
    /** active - true 执行进入动画，false 执行离开动画 */
    active: boolean = false;
    [key:string]: any;
    /** 只允许页面存在一个toast */
    static instance: any;
    constructor(options?: ComponentOptions<any>) {
        super();
    }

    /**
     * 关闭弹窗
     */
    untoast() {
        // 离开
        setTimeout(() => {
            this.active = false;
        }, this.enter + this.duration);
        // 彻底移除
        setTimeout(() => {
            document.body.removeChild(this.$el);
            ToastComponent.instance = null;
        }, this.enter + this.duration + this.leave);
    }
    /**
     * 创建弹出式tip
     * @param tip 提示字符
     * @param duration? 持续时间ms 默认2000ms
     */
    static toast(options: Toast): ToastComponent {
        const instance = ToastComponent.instance;
        if (instance) {return instance; }
        options = options || <any>{};
        const o = {
            enter: 200,
            leave: 200,
            duration: 1500,
            text: '什么也木有~',
            animation: 'trans1'
        }
        Object.assign(o, options);
        const el = document.createElement('div');
        // 添加data响应数据
        const tip = new ToastComponent({el,  data: o});
        ToastComponent.instance = tip;
        document.body.appendChild(tip.$el);
        // 进入
        setTimeout(() => {
            tip.active = true;
        });
        // 等待回调关闭
        if(o.duration === -1 || o.duration === Infinity) {
            tip.duration = -1;
            return tip;
        }
        // 关闭
        tip.untoast();
        return tip;
    }
}

export interface Toast {
    /* 提示文字 */
    text?: string;
    /**
     * 动画名称
     * - trans1 从下往上（进入） -> 从下到上（离开）
     * - trans2 从下到上（进入） -> 从下往上（离开）
     * - scale  放大（进入） -> 从下到上（离开）缩小
     */
    animation?: string;
    /** 停留时间 */
    duration?: number;
    /** 进入过渡时间 */
    enter?: number;
    /** 离开过渡时间 */
    leave?: number;
}