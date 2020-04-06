
/*
 * Filename: d:\frontend\vue\nuxt-ssr\components\commons\alert\pop\pop.ts
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Friday, January 3rd 2020, 10:00:56 pm
 * Author: zzp-dog
 *
 * Copyright (c) 2020 Your Company
 */

import Vue, { ComponentOptions } from 'vue';
import Component from 'vue-class-component';
/**
 * pop组件（弹出层的一种）
 *
 * 可以通过调用静态方法showPop弹出该组件，
 */
@Component
export default class PopComponent extends Vue {
    /** 是否进入停留状态 */
    active: boolean = false;
    [key: string]: any;

    constructor(options: ComponentOptions<any> | any) {
        super();
    }

    /**
     * 点击关闭弹窗
     * @param e 事件
     */
    close(e: any) {
        // 离开
        this.active = false;
        (<any>this.$refs.mask).style.display = 'none';
        // 移除
        setTimeout(() => {
            document.body.removeChild(this.$el);
            const close = this.callback.close;
            close && close(e);
            return;
        }, this.leave)
    }

    /**
     * 打开弹窗
     */
    open() {
        (<any>this.$refs.mask).style.display = 'block';
        document.body.appendChild(this.$el);
        // 进入
        setTimeout(() => {
            this.active = true;
        })
    }

    /**
     * 弹出pop式弹窗
     * @param options 配置参数
     * @returns PopComponent
     */
    static showPop(options?: PopOptions): PopComponent {
        options = options || <any>{};
        // 默认参数
        const o: any = {
            animation: 'trans1',
            enter: 200,
            leave: 200,
            callback: {},
            content: '什么也没有~'
        }
        Object.assign(o, options);
        const el = document.createElement('div');
        const $options: any = { el, data: o };
        // “投影”内容，默认传入字符串-'什么也没有~'
        const content = o.content;
        if (typeof content === 'function') { // 如果传入组件类
            $options.data.handler = o.handler || {};
            $options.components = { child: content };
        }
        // 组件实例
        const pop = new PopComponent($options);
        // 打开弹出层pop
        pop.open();
        return pop;
    }
}


export interface PopOptions {
    /**
     * 动画名称
     * - trans1 从下往上（进入） -> 从下到上（离开）
     * - trans2 从下到上（进入） -> 从下往上（离开）
     * - scale  放大（进入） -> 从下到上（离开）缩小
     */
    animation?: string;
    /** 进入过渡时间 */
    enter?: number;
    /** 离开过渡时间 */
    leave?: number;
    /** 回调 */
    callback?: PopCallback;
    /** html | 子组件 被ts-loader编译后的 */
    content?: string | Vue;
    /**
     * vue实例句柄 , content组件可通过$attrs.handler拿到这个句柄
     */
    handler?: Vue;
}

/** 回调 */
export interface PopCallback {
    /** 关闭回调 */
    close?: Function;
}
