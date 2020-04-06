/*
 * Filename: d:\frontend\vue\nuxt-ssr\components\projections\sidebar-nav\sidebar-nav.ts
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Sunday, December 29th 2019, 2:11:23 pm
 * Author: zzp-dog
 * 导航式侧边栏容器 - position:fixed;配合side-menu组件使用
 * Copyright (c) 2019 Your Company
 */
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import DomUtil from '../../../util/dom-util';

@Component
export default class SidebarNavComponent extends Vue {
    /** 本组件容器 */
    @Ref('sidebar_nav') sidebarNav: any;
    constructor() {
        super();
    }

    public mounted(): void {
        // this.setBottom();
        window.onscroll = this.onscroll;
    }

    /**
     * 滚动事件
     */
    onscroll() {
        // this.setBottom();
    }

    /**
     * 设置底部
     */
    setBottom() {
        let sbottom;
        // 计算视窗高度
        const bh = document.body.offsetHeight;
        // 找底部组件
        const footer = document.getElementById('id-app-footer');
        // 没有底部组件
        if (!footer || (<any>footer.style).disply === 'none') {
            this.sidebarNav.style.bottom = '0';
            return;
        }
        // 计算底部组件顶部到视窗顶部距离
        const fttt = DomUtil.getElementRect(footer).top;
        if (fttt <= bh) sbottom = (bh - fttt) + 'px'
        else sbottom = '0px';
        this.sidebarNav.style.bottom = sbottom;
    }

    destroyed() {
        window.onscroll = null;
    }
}