/*
 * Filename: d:\frontend\vue\nuxt-ssr\components\commons\reply\reply.ts
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Sunday, December 15th 2019, 9:01:43 pm
 * Author: zzp-dog
 * 回复组件
 * Copyright (c) 2019 Your Company
 */

import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Model, Emit, Ref } from 'vue-property-decorator';
import EmojiComponent from '../emoji/emoji.vue'; // 表情组件

@Component({data(vm: any){return {spread$: vm.spread}},
components: {
    EmojiComponent
}
})
export default class ReplyComponent extends Vue {
    /** texarea的id */
    @Prop({type: String, default: null})
    id!: string;
    /** 暗锚点参数 暗锚点,因为要调整跳转后锚点的距离顶部的位置，所以需要传入锚点参数name使用一个隐藏的a锚点进行回复组件的跳转定位*/
    @Prop({type: Object, default: () => {return {name: '', top: 0}}})
    anchorPoint!: object;
    /** 是否全部展开，默认true */
    @Prop({type: Boolean, default: true})
    spread!: boolean;
    /** 是否全部展开 的副本，默认true */
    spread$!: boolean;
    /** 未登录禁用 */
    @Prop({type: Boolean, default: true})
    disabled!: boolean;
    /** 占位文字 placeholder*/ 
    @Prop({
        type: String,
        default: '请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。'
    })
    placeholder!: string;
    get placeholder$() {
        return this.placeholder || '请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。';
    }
    /** v-model */
    @Model('input')
    @Prop({type: String, default: ''})
    model!: any;
    get model$() {
        // 强制添加响应式
        if (!this.model)this.model$ = '';
        return this.model;
    }
    set model$(v: string) {
        this.$emit('input', v);
    }
    /** 是否展示提交按钮，默认展示 */
    @Prop({type: Boolean, default: true})
    showBtn!: boolean;
    /** 是否显示表情 */
    @Prop({type: Boolean,default: true})
    showEmoji!: boolean;
    /** 是否支持utf8mb4 */
    @Prop({type: Boolean, default: true})
    utf8mb4!: boolean;
    /** textarea */
    @Ref('textarea')
    textarea: any;
    constructor() {
        super();
    }

    /**
     * texarea输入聚焦
     */
    focus(e: any) {
        if (!this.spread$)
        this.spread$ = true;
        this.$emit('focus', e);
    }

    /**
     * 点击回复
     */
    reply() {
        if (this.spread$)
        this.$emit('submit', this.model);
        else {
            this.spread$ = true;
        }
    }

    /**
     * 选择表情
     */
    selectEmoji(e: any) {
        // 数据库（如mysql）字符集设置了utf8，而不是utf8mb4，则直接存入表情字符会被截取，要使用unicode字符串出入
        // 如果数据库设置字符集为utfmb4，则可直接存入表情符
        this.model$ = this.model$ + (this.utf8mb4? e.text : e.uc);
        // 选择表情后textarea聚焦
        this.textarea.focus();
        this.$emit('focus', e);
    }
}