/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\core\modules\components\live2d\index.ts
 * Created Date: Sunday, July 5th 2020, 11:13:14 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: live2d模型组件
 * Last Modified: Wednesday July 8th 2020 10:41:31 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

import Vue from 'vue';
import Axios, { AxiosInstance } from 'axios'
import Component from 'vue-class-component';
import ThirdSource from '../../util/js-util';
import consts from '../../../consts';
import { Prop, Ref, Model } from 'vue-property-decorator';
import DomUtil from '../../util/dom-util';

declare const loadlive2d: Function;
declare interface Model {
    name: string; url: string; eventObjUrl: string
}
declare interface EventObject {
    [key: string]: any[]
}
const DEFAULT_MESSAGE = {
    /** 思考中~ */
    message01: '思考中~',
    /** 啥意思~ */
    message02: '啥意思~',
    /** 维修中~ */
    message03: '维修中~',
    /** 崩溃啦~ */
    message04: '崩溃啦~',
}
@Component
export default class Live2dComponent extends Vue {
    /** 是否显示本组件 */
    @Prop({ default: true }) show!: boolean;
    /** 模型容器 */
    @Ref('box') box: any;
    /** 是否显示召唤按钮 , 默认显示*/
    showBtn: boolean = true;
    /** 是否显示对话框，默认不显示 */
    showTalk: boolean = false;
    /** 模型集合 */
    live2dModels!: Model[];
    /** 模型下标 ， 默认第一个模型*/
    index: number = 0;
    /** 当前模型 */
    model: Model = <Model>{};
    /** ajax */
    axios!: AxiosInstance;
    /** 自定义的事件配置对象 */
    eventObj!: EventObject;
    /** 模型头部消息 */
    message: string = '';
    /** 销毁时要调用的钩子 */
    hooks: Function[] = [];
    /** 用户输入的 */
    text: string = '';
    /** 自动话术 */
    autoMessage!: string[];
    /** 是否自动说话 */
    auto: boolean = true;
    /** 自动说话定时器 */
    timer: any;

    constructor() {
        super();
    }

    /**
     * 挂载前知行
     */
    beforeMount() {
        this.setModel();
        this.setAxios();
    }
    
    mounted() {
        this.setEvent();
    }

    destoryed() {
        this.clearModelEvent();
    }

    /**
     * 清除与模型相关的事件
     */
    clearModelEvent() {
        if (this.hooks.length) {
            this.hooks.forEach((fn: Function) => {
                fn();
            });
        }
        this.clearAutoSayEvent();
    }

    /**
     * 设置模型
     * @param json_url 模型json配置文件
     */
    setModel() {
        this.live2dModels = consts.live2dModels;
        return new Promise(res => {
            ThirdSource.loadJS(consts.JS_MAPS.live2d, () => {
                this.loadModel();
                res();
            });
        })
    }

    /**
     * 加载模型
     * @param index 模型下标
     */
    loadModel(index: number = 0) {
        this.model = this.live2dModels[index];
        loadlive2d('live2d', this.live2dModels[index].url);       
    }

    /**
     * 设置axios
     * @param options axios实例化配置参数
     */
    setAxios(options?: any) {
        this.axios = this.axiosFactory(options);
    }

    /**
     * 设置事件
     */
    setEvent() {
        this.setResizeEvent();
        this.setModelEvent();
        
    }

    /**
     * 设置模型事件
     */
    setModelEvent() {
        return this.axios.get(this.model.eventObjUrl).then((data: any) => {
            this.eventObj = data.data;
            const events = Object.keys(this.eventObj);
            for (let event of events) {
                const objs = this.eventObj[event];
                if (event === 'auto') { // 自动话术
                    this.autoMessage = objs;
                }
                for (let obj of objs) {
                    this.bindEvent(event, obj);
                }
            }
            if (!this.auto) return;
            // 自动说话
            this.setAutoSayEvent();
        });
    }

    /**
     * 给元素绑定事件
     * @param {string} event - 事件名
     * @param {{selector: string; text: string}} obj - 元素配置参数对象
     */
    bindEvent(event: string, obj: { selector: string; text: string }) {
        let isMouseover = false;
        let el: any = document.querySelector('.ui-live2d ' + obj.selector);
        if (!el) return;
        if (event === 'mouseover') {
            isMouseover = true;
            event +=' touchstart'; // 移动端设置touchmove效果不明显，设置touchstart
        }
        el.$text = obj.text;
        this.handleEvent(el, event, this.setMessage);
        if (!isMouseover) {
            return;
        }
        // 是鼠标悬浮事件，则设置非悬浮时隐藏消息
        event = 'mouseout touchend';
        this.handleEvent(el, event, this.resetMessage);
    }

    /**
     * 绑定事件和设置解绑事件钩子
     * @param el 元素
     * @param event 事件
     * @param fn 事件函数
     */
    handleEvent(el: any, event: string, fn: Function) {
        DomUtil.addEvent(el, event, fn);
        this.hooks.push(() => {
            DomUtil.removeEvent(el, event, fn);
        });
    }

    /**
     * 设置模型头部消息
     * @param e 事件
     */
    setMessage(e: any) {
        const ct = e.currentTarget;
        const ecount = e.name + 'count';
        let text = ct.$text;
        if (!ct[ecount]) {
            ct[ecount] = 0;
        }
        if (text instanceof Array) {
            text = text[ct[ecount] % text.length];
            ct[ecount]++;
        }
        this.message = text;
    }

    /**
     * 重置消息
     */
    resetMessage() {
        this.message = '';
    }

    /**
     * 鼠标悬浮提示，打开或关闭自动说话
     */
    hoverSwitchAutoSay() {
        if (this.auto) {
            this.message = '关闭自动说话~';
            return;
        }
        this.message = '切换为自动说话~';
    }

    /**
     * 点击打开或关闭自动说话
     */
    clickSwitchAutoSay() {
        if (this.auto) {
            this.clearAutoSayEvent();
            this.resetMessage();
            return;
        }
        this.setAutoSayEvent();
        this.auto = true;
    }

    /**
     * 清除定时器
     */
    clearAutoSayEvent() {
        clearInterval(this.timer);
        this.auto = false;
    }

    /**
     * 当窗口改变大小时，重新设置容器的可移动范围
     */
    setResizeEvent() {
        if (window) {
            (<any>window).onresize = this.setBorder;
        }
    }

    /**
     * auto为true时自动说话
     */
    setAutoSayEvent() {
        let index = 0;
        this.timer = setInterval(() => {
            this.message = this.autoMessage[index++%this.autoMessage.length];
        }, 5000);
    }

    /**
     * 发送消息
     */
    send() {
        this.clearAutoSayEvent();
        this.message = DEFAULT_MESSAGE.message01;
        if (!this.text) {
            return;
        }
        const active = consts.robot.active;
        // @ts-ignore
        const robot = consts.robot[active];
        const api = robot.api + this.text;
        this.axios.get(api).then((data: any) => {
            const res = data.data;
            if (!res) {
                this.message = DEFAULT_MESSAGE.message03;
                return;
            }
            const sucess = eval('(' + 'res.' + robot.success.key + ')');
            if ( sucess !== robot.success.value) {
                this.message = DEFAULT_MESSAGE.message03;
                return;
            }
            const type = eval('(' + 'res.' + robot.isText.key + ')');
            if ( type === robot.isText.value) {
                this.message = eval('(' + 'res.' + robot.reply.key + ')');
                return;
            } 
            this.message = DEFAULT_MESSAGE.message02;
        }).catch(() => {
            this.message = DEFAULT_MESSAGE.message04;
        })
    }

    /**
     * 切换模型
     */
    switchModel() {
        const index = ++this.index%this.live2dModels.length;
        this.loadModel(index);
        this.clearModelEvent();
        this.setModelEvent();
    }

    axiosFactory(options?: any) {
        return Axios.create(options);
    }

    /**
     * 设置容器可移动的范围
     */
    setBorder() {
        this.box.$border = {
            right: {
                min: 0,
                max: window.innerWidth - 250 // 250为容器宽度
            },
            bottom: {
                min: 0,
                max: window.innerHeight - 280 // 280为容器高度
            }
        }
    }

    /**
     * 开始移动
     * @param e 事件
     */
    start(e: any) {
        this.end();
        e.target.ondragstart = () => false;
        DomUtil.addEvent(document, 'mousemove touchmove', this.move);
        DomUtil.addEvent(document, 'mouseup touchend', this.end);
        this.box.$start = {
            x: e.clientX || (e.changedTouches && e.changedTouches[0].pageX) || 0,
            y: e.clientY || (e.changedTouches && e.changedTouches[0].pageY) || 0
        };
        this.box.$position = {
            right: parseFloat(this.box.style.right),
            bottom: parseFloat(this.box.style.bottom)
        }
        if (!this.box.$border) {
            this.setBorder();
        }
    }

    /**
     * 移动
     * @param e 事件
     */
    move(e: any) {
        const x = e.clientX || (e.changedTouches && e.changedTouches[0].pageX) || 0;
        const y = e.clientY || (e.changedTouches && e.changedTouches[0].pageY) || 0;
        let deltaX = x - this.box.$start.x;
        let deltaY = y - this.box.$start.y;
        const s_right = this.box.$position.right;
        const s_bottom = this.box.$position.bottom;
        if (s_right - deltaX < 0) {
            deltaX = s_right;
        }
        if (s_right - deltaX > this.box.$border.right.max) {
            deltaX = s_right - this.box.$border.right.max;
        }
        if (s_bottom - deltaY < 0) {
            deltaY = s_bottom;
        }
        if (s_bottom - deltaY > this.box.$border.bottom.max) {
            deltaY = s_bottom - this.box.$border.bottom.max;
        }
        this.box.style.right = (s_right - deltaX) + 'px';
        this.box.style.bottom = (s_bottom - deltaY) + 'px';
    }

    /**
     * 结束移动
     */
    end() {
        DomUtil.removeEvent(document, 'mousemove touchmove', this.move);
        DomUtil.removeEvent(document, 'mouseup touchend', this.end);
    }

}