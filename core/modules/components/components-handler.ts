import LoaderComponent from "./app-loader/app-loader";
import AlertComponent, {AlertOption} from './app-alert/app-alert';
import ToastComponent,{Toast} from "./app-toast/app-toast";
/**
 * 全局静态调用组件持有者
 */
export default interface ComponentsHandler {
    /** 打开遮罩 @param {string} type - 'timer' 时钟[默认]*/
    load(type?:string): void;
    /** 关闭遮罩 */
    unload(): void;
    /** 打开弹窗（类似移动端样式）,只有一个按钮时返回1，两个按钮时1-左边，2-右边 */
    alert(options: AlertOption): Promise<number>;
    /** 打开提示 */
    toast(optioin: Toast): ComponentsHandler;
    /** 关闭提示 */
    untoast(): void;

}
export default class ComponentsHandler {
    public load(type?:string) {
        LoaderComponent.load();
    }
    public unload() {
        LoaderComponent.unload();
    }
    public toast(option: Toast): ComponentsHandler {
        const toast = ToastComponent.toast(option);
        const d = option.duration;
        if(d && d < 0 || d === Infinity) {
            (<any>this).toastInstance = toast;
        }
        return this;
    }
    public untoast() {
        if ((<any>this).toastInstance) {
            (<any>this).toastInstance.untoast();
            (<any>this).toastInstance = null;
        }
    }
    public alert(options: AlertOption): Promise<number> {
        return AlertComponent.alert(options);        
    }
}