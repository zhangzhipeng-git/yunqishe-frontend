import Vue, { ComponentOptions } from 'vue';
import Component from 'vue-class-component';
// 依赖
import DomUtil from '../../util/dom-util';
import tap from '../../directives/tappable';
@Component({
    directives: {
        tap
    }
})
export default class AppAlertComponent extends Vue {

    public title: string = '';
    public content: string = '出了点小问题~';
    public buttons: string[] = ['取消', '确认'];

    constructor(options?: ComponentOptions<any>) {
        super();
    }

    public setOptoins(option: AlertOption) {
        this.title = option.title || this.title;
        this.content = option.content || this.content;
        this.buttons = option.buttons || this.buttons;
    }

    public static alert(options: AlertOption | any = {}): Promise<number> {
        const el = document.createElement('div');
        // 经@Component装饰后的类会变成Vue.extend(options)的组件类
        let alert: any = new AppAlertComponent({el});
        // 设置参数
        alert.setOptoins(options);
        const button1 = alert.$refs.button1;
        const button2 = alert.$refs.button2;
        document.body.appendChild(alert.$el);
        // 返回承诺
        return new Promise((resolve) => {
            DomUtil.addEvent(button1, 'click', () => {
                document.body.removeChild(alert.$el);
                alert = null;
                resolve(1);
            });
            DomUtil.addEvent(button2, 'click', () => {
                document.body.removeChild(alert.$el);
                alert = null;
                resolve(2);
            })
        });
    }
}
/**
 * 我的弹出窗配置参数
 */
export interface AlertOption {
    /** 弹窗标题 */
    title?: string;
    /** 提示内容 */
    content: string;
    /** 取消和确认按钮 */
    buttons: string[];
}
