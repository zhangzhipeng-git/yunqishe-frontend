
/**
 * 操作dom的兼容性方法
 */
export default interface DomUtil {
    /**
     * e.getBoundingClientRect();
     * 获取元素相对于视窗的top，left，bottom，right
     * 属性都是相对于视口的左上角位置而言的!!!!可能为负数！！！
     * @param e html元素
     * @returns e.getBoundingClientRect();
     */
    getElementRect(e: any): any;
    /**
     * 获取滚动条宽度
     */
    getScrollbarWidth():any;
    /**
     * 获取前一个兄弟节点
     * @param elem dom节点
     */
    previousSibling(elem: any): any
    /**
     * 获取下一个兄弟节点
     * @param elem dom节点
     */
    nextSibling(elem: any): any
    /**
     * 计算最终样式
     * @param {HTMLElement} el 元素
     * @param {string} key 样式 - 驼峰式
     */
    getcomputedStyle(el: HTMLElement | any, key: any): any;
    /**
     * 判断是否移动端
     * @returns {boolen} true - 是移动端 false - 不是移动端
     */
    isMB(): boolean;
    /**
     * 根据平台返回滑动对象
     */
    getMove(): {[key: string]: any} ;
    /**
     * 添加事件
     * @param el 添加事件的元素
     * @param event 添加的事件
     * @param f 事件绑定函数
     * @param bubble 是否冒泡，默认冒泡
     */
    addEvent(el: any, event: string, f: Function, useCapture?: false): any; 
    /**
     * 移除事件
     * @param el 移除时间的元素
     * @param event 移除的事件
     * @param f 事件绑定的函数
     */
    removeEvent(el: any, event: string, f: Function, useCapture?: false): any;
    /**
     * 获取兼容设置style的文本
     * @param key style key
     * @param value style value
     * @returns cssText
     */
    getPrefixCssText(key: string, value: string): string;
    /**
     * 兼容设置style
     * @param el html元素
     * @param key style key
     * @param value style value
     */
    setPrefixStyle(el: any, key: string, value: string): any;
    /**
     * 兼容获取元素style key对应的值
     * @param el html元素
     * @param key 样式key
     */
    getPrefixStyle(el: any, key: string): any;
    /**
     * 判断是否支持动画
     */
    supportAnimation(): boolean
}
export default class DomUtil {

    private constructor() {}

    /**
     * e.getBoundingClientRect();
     * 获取元素相对于视窗的top，left，bottom，right
     * 属性都是相对于视口的左上角位置而言的!!!!可能为负数！！！
     * @param e html元素
     * @returns e.getBoundingClientRect();
     */
    public static getElementRect(e: any) {
        return e.getBoundingClientRect();
    }
    /**
     * 获取滚动条宽度
     */
    public static getScrollbarWidth() {
        var odiv = document.createElement('div'),//创建一个div
            styles: any = {
                width: '100px',
                height: '100px',
                overflowY: 'scroll'//让他有滚动条
            }, i, scrollbarWidth;
        for (i in styles) (<any>odiv).style[i] = styles[i];
        document.body.appendChild(odiv);//把div添加到body中
        scrollbarWidth = odiv.offsetWidth - odiv.clientWidth;//相减
        odiv.remove();//移除创建的div
        return scrollbarWidth;//返回滚动条宽度
    }
    /**
     * 获取前一个兄弟节点
     * @param elem dom节点
     */
    public static previousSibling(elem: any): any{
        var pre = elem.previousSibling;
        while(pre&&pre.nodeType!=1){
            pre = pre.previousSibling;
        };
        return pre;
    }    

    /**
     * 获取下一个兄弟节点
     * @param elem dom节点
     */
    public static nextSibling(elem: any): any{
        var pre = elem.nextSibling;
        while(pre&&pre.nodeType!=1){
            pre = pre.nextSibling;
        };
        return pre;
    }

    /**
     * 计算最终样式
     * @param {HTMLElement} el 元素
     * @param {string} key 样式 - 驼峰式
     */
    public static getcomputedStyle(el: HTMLElement | any, key: any) {
        return (window.getComputedStyle && window.getComputedStyle(el, null)[key]) || el.currentStyle[key];
    }
    /**
     * 判断是否移动端
     * @returns {boolen} true - 是移动端 false - 不是移动端
     */
    public static isMB(): boolean {
        // tslint:disable-next-line: max-line-length
        const navigator = (<any>global||window).navigator || {userAgent:''};
        return /iphone|ipod|ios|android|BlackBerry|windows ce|windows mobile|webos|SymbianOS/i.test((navigator).userAgent);
    }

    /**
     * 根据平台返回滑动对象
     */
    public static getMove(): {[key: string]: any} {
        const obj = {} as any;
        if (DomUtil.isMB()) {
            obj.start = 'touchstart';
            obj.move = 'touchmove';
            obj.end = 'touchend';
            return obj;
        }
        obj.start = 'mousedown',
        obj.move = 'mousemove',
        obj.end = 'mouseup'
        return obj;
    }

    /**
     * 添加事件
     * @param el 添加事件的元素
     * @param event 添加的事件
     * @param f 事件绑定函数
     * @param bubble 是否冒泡，默认冒泡
     */
    public static addEvent(el: any, event: string, f: Function, useCapture: boolean = false) {
        const es = event.split(/\s+/);
        es.forEach((e: string) => {
            if (el.addEventListener) {
                el.addEventListener(e, f, useCapture);
            } else if (el.attachEvent) {
                el.attachEvent('on' + e, f.bind(el), useCapture);
            }
        });
    }

    /**
     * 移除事件
     * @param el 移除时间的元素
     * @param event 移除的事件
     * @param f 事件绑定的函数
     */
    public static removeEvent(el: any, event: string, f: Function, useCapture: boolean = false) {
        const es = event.split(/\s+/);
        es.forEach((e: string) => {
            if (el.removeEventListener) {
                el.removeEventListener(e, f, useCapture);
            } else if (el.detachEvent) {
                el.detachEvent('on' + e, f, useCapture);
            }
        });
    }
    /**
     * 获取兼容设置style的文本
     * @param key style key
     * @param value style value
     * @returns cssText
     */
    public static getPrefixCssText(key: string, value: string) {
        const prefix = ['', '-webkit-', '-ms-', '-moz-'];
        let style = '';
        prefix.forEach((e) => {
            style += ';' + e + key + ':' + value;
        })
        return style;
    }
    /**
     * 兼容设置style
     * @param el html元素
     * @param key style key
     * @param value style value
     */
    public static setPrefixStyle(el: any, key: string, value: string) {
        const prefix = ['webkit', 'ms', 'moz'];
        // 变成驼峰式
        // tslint:disable-next-line: arrow-parens
        key = key.replace(/(-[a-z])/g, match =>  match.substr(1).toUpperCase());
        // 设置有前缀的，key的首字母要大写
        const k = key.substr(0, 1).toUpperCase() + key.substr(1);
        prefix.forEach((item) => {
            el.style[item] += ';' + item + k + ':' + value;
        });
        // 设置没有前缀的
        el.style[key] += ';' + key + ':' + value;
    }

    /**
     * 兼容获取元素style key对应的值
     * @param el html元素
     * @param key 样式key
     */
    public static getPrefixStyle(el: any, key: string) {
        // key变成驼峰式
        // tslint:disable-next-line: arrow-parens
        key = key.replace(/(-[a-z])/g, match =>  match.substr(1).toUpperCase());
        // 取无前缀的
        const style_ = el.style[key];
        if (style_) return style_;
        // 取有前缀的
        let result:any = undefined;
        const prefix = ['webkit', 'ms', 'moz'];
        const k = key.substr(0, 1).toUpperCase() + key.substr(1);
        prefix.forEach((item) => {
            const style = el.style[item + k];
            if (style) {
                result = style;
            }
        });
        return result;
    }

    /**
     * 判断是否支持动画
     */
    public static supportAnimation(): boolean {
        const arr: any = ['moz', 'ms', 'webkit', 'Khtml'];
        const div = document.createElement('div') as any;
        if (div.style.animationName !== undefined) {
            return true;
        }
        for (let i = 0, len = arr.length; i < len; i++) {
            const prefix = arr[i];
            if (div.style[prefix + 'AnimationName'] !== undefined) {
                return true;
            }
        }
        return false;
    }
}

