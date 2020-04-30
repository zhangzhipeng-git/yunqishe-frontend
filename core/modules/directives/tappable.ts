import DomUtil from '../util/dom-util';
import VueDirective from './directive';
/**
 * Tap 指令 防点透和时延
 */
class Tap implements VueDirective {
    // tslint:disable: member-access
    /** 是否移动端 */
    static isMB: boolean;

    constructor() {
        Tap.isMB = DomUtil.isMB();
    }

    public bind(el: HTMLElement | any) {
        el.style.cursor = 'pointer';
        if (!Tap.isMB) { // 非移动端
            return;
        }
        // 移动端是点击事件是 touchstart -> touchmove -> touchend -> touchcancel | click
        DomUtil.addEvent(el, 'touchend', Tap.ontouchend);
        DomUtil.addEvent(el, 'touchstart', Tap.ontouchstart);
    }

    public unbind(el: HTMLElement | any) {
        DomUtil.removeEvent(el, 'touchend', Tap.ontouchend);
        DomUtil.removeEvent(el, 'touchstart', Tap.ontouchstart);
    }

    public static ontouchstart(e: Event | any) {
        // tslint:disable-next-line: variable-name
        const _this = this as any;
        e = e || event;
        _this.startT = new Date().getTime();
        _this.startY = e.changedTouches[0].pageY;
        _this.startX = e.changedTouches[0].pageX;
    }

    public static ontouchend(e: Event | any) {
        // tslint:disable-next-line: variable-name
        const _this = this as any;
        e = e || event;

        // MDN:在许多事件的监听回调中调用preventDefault()前，
        // 都需要检查 cancelable 属性的值。

        if (typeof e.cancelable !== 'boolean' || e.cancelable) { // 阻止默认事件，取消后续事件默认操作
            e.preventDefault();
            e.returnValue = false; // 兼容IE
        } else { // touchcancel，不会触发click
            return;
        }

        const endT = new Date().getTime();
        const endY = e.changedTouches[0].pageY;
        const endX = e.changedTouches[0].pageX;

        if (_this.startY !== endY || _this.startX !== endX) {
            return;
        }
        if (endT - _this.startT > 300) {
            return;
        }
        // 调用点击事件解决300ms延迟, 不模拟click
        _this.click();
        return;

    }
}

export default new Tap();
