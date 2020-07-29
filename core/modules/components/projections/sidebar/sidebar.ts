/*
* Filename: d:\frontend\vue\nuxt-ssr\components\projections\sidebar\sidebar.ts
* Path: d:\frontend\vue\nuxt-ssr
* Created Date: Friday, December 20th 2019, 11:41:41 pm
* Author: zzp-dog
* 侧边栏容器-高度随兄弟节点高度变化而变化
* Copyright (c) 2019 Your Company
*/


import Vue from 'vue';
import DomUtil from '../../../util/dom-util';
import Component from 'vue-class-component';
import { Prop, Watch, Ref} from 'vue-property-decorator';

@Component
export default class SidebarComponent extends Vue {
    /** 侧边栏 */
    @Ref('$sidebar') sidebar: any;
    /** 高度调整 */
    @Prop({type: String,default: '0'}) bottom!: string;
    /** 兄弟节点索引 */
    @Prop({type: Number, default: 0})
    siblingIndex!:number;
    siblingHeight!: number;
    /** 最小主题内容高度 */
    minMainHeight!: number;

    @Watch('bottom', {immediate: true}) 
    watchBottom(nv: any, ov: any) {
        if (process&&process.server) return;
        this.$nextTick(() => {
            this.sidebar.style.bottom = nv;
        });
    }

    /** 获取侧边栏父节点 */
    get parent() {
        return this.sidebar.parentNode;
    }

    constructor() {
        super();
    }

    mounted() {
        if (this.parent.style.cssText.indexOf('position: relative') < 0) {
            this.parent.style.position = 'relative';
        }
        const rsize = parseInt(DomUtil.getcomputedStyle(document.body, 'fontSize'));
        // 调整底部定位
        this.sidebar.style.position = 'absolute';
        // 计算最小主体内容高度
        const header: any = document.getElementById('id-app-header');
        const footer: any = document.getElementById('id-app-footer')||{offsetHeight:0};
        const headerHeight = header.offsetHeight + 0.7 * rsize;
        const footerHeight = footer.offsetHeight + 1.0 * rsize;
        const minMainHeight = document.body.offsetHeight - headerHeight - footerHeight;
        this.sidebar.style.minHeight = minMainHeight + 'px';
    }
}