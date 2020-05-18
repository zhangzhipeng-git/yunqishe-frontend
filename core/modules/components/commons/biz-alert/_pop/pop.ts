
/*
 * Filename: d:\frontend\vue\nuxt-ssr\components\commons\alert\pop\pop.ts
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Friday, January 3rd 2020, 10:00:56 pm
 * Author: zzp-dog
 *
 * Copyright (c) 2020 Your Company
 */

import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';
/**
 * pop组件（弹出层的一种）
 *
 * 可以通过调用静态方法showPop弹出该组件，
 */
@Component
export default class PopComponent extends Vue {
    /** 是否进入停留状态 */
    active: boolean = false;
    /** 初始不显示 */
    show:boolean = false;
    /** 进入和离开的动画名称 */
    @Prop({type: String,default:'scale'})
    animation!:string;
    /** 进入动画时长 */
    @Prop({type: Number,default:200})
    enter!: number;
    /** 离开动画时长 */
    @Prop({type: Number,default:200})
    leave!: number;

    constructor() {
        super();
    }

    /**
     * 点击关闭弹窗
     * @param e 事件
     */
    @Emit('close')
    close(e?: any) {
        // 离开
        this.active = false;
        (<any>this.$refs.mask).style.display = 'none';
        // 移除
        setTimeout(() => {
            document.body.removeChild(this.$el);
        }, this.leave);
        return {
            event: 'close',
            delay: this.leave
        }
    }

    /**
     * 打开弹窗
     */
    @Emit('open')
    open() {
        document.body.appendChild(this.$el);
        (<any>this.$refs.mask).style.display = 'block';
        this.show = true;
        // 进入
        setTimeout(() => {
            this.active = true;
        })
        return {
            event:'open',
            delay: this.enter
        };
    }

}
