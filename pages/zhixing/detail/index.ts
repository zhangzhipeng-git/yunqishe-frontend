/*
* Filename: d:\frontend\vue\nuxt-ssr\pages\learn\doc-detail\_id.ts
* Path: d:\frontend\vue\nuxt-ssr
* Created Date: Saturday, December 28th 2019, 5:24:11 pm
* Author: zzp-dog
* 文档详情
* Copyright (c) 2019 Your Company
*/import Component from 'vue-class-component';
import SideMenuComponent from '@/core/modules/components/commons/side-menu/side-menu.vue';
import SidebarNavComponent from '@/core/modules/components/projections/sidebar-nav/sidebar-nav.vue';
import BaseComponent from '~/core/base-component';
import { Ref } from 'vue-property-decorator';
import { Context } from '@nuxt/types';
import DocClass from '../../../service/doc-class/index';
import DocContentService from '~/service/doc-content';
/**
 * 处理菜单树
 * @param data 响应数据
 * @param pid 章的父id，即二级分类的id
 * @param name 上一页过来的分类名称如“H5”
 * @param id 节id
 */
const handleTree = (data: any, pid: string, name: string, id: number) => {
    const docClasses = data.docClasses;
    if (!docClasses) return <any>[];
    // 默认第一章第一节聚焦
    docClasses.active = docClasses[0].docClasses[0];
    docClasses.forEach((doc: any) => {
        doc.level = 1;
        doc.rightIcon = ["icon-caret-left", "icon-caret-down"];
        doc.docClasses.forEach((doc$: any) => {
            if (Number(id) === doc$.id) {
                docClasses.active = doc$;
            }
            doc$.level = 2;
            doc$.parent = doc;
            doc$.url = '/zhixing/detail?pid=' + pid + '&name=' + name + '&id=' + doc$.id + '&zname=' + doc.name + '&jname=' + doc$.name;
        });
    });
    return docClasses;
}
const asyncData = async (context: Context) => {
    const app = BaseComponent.getSingleton();
    app.handler.load();
    /** 菜单树 */
    let trees: any = [];
    /** 文档内容html */
    let vhtml: string = '';
    /** 路由查询参数对象 */
    const query = context.route.query;
    /** 文档内容id */
    let id: any = query.id || -1;
    /** 章的父id，根据这个id查章和节 */
    const pid: any = query.pid;
    /** 章的父类名称 */
    const name: string = query.name + '';
    /** 章名称 */
    let zname: string = '';
    /** 节名称 */
    let jname: string = '';
    /** 上一页url */
    const pre = context.from && context.from.fullPath;
    await app.httpRequest(DocClass.selectEnd2LvList({ pid }, '/f'), {
        success: (data: any) => {
            trees = handleTree(data, pid, name, id);
            const active = trees.active;
            id = active.id;
            jname = active.name;
            zname = active.parent.name;
        },
        error: async (data: any) => {
            await app.handleError(data, () => { context.redirect(pre) });
        },
        context
    });
    // 没有章节则退出
    if (!trees.length) { app.handler.unload(); return; }
    await app.httpRequest(DocContentService.selectOne({ id }, '/f'), {
        success: (data: any) => {
            if (data.docContent) { vhtml = app.cleanVHtml(data.docContent.text); }
        },
        error: async (data: any) => {
            await app.handleError(data, () => { context.redirect(pre) });
        },
        context
    });
    const o = { name, zname, jname, trees, vhtml };
    app.setAsyncData(o);
    app.handler.unload();
    return o;
}

const options = {
    layout: 'app2',
    components: {
        SidebarNavComponent,
        SideMenuComponent
    },
    asyncData
}
@Component(options)
export default class DetailComponent extends BaseComponent {
    /** 文档内容容器 */
    @Ref('doc')
    doc!: any;
    /** 文档名称 */
    name: string = '';
    /** 章名称 */
    zname: string = '';
    /** 节名称 */
    jname: string = '';
    /** 章和节 */
    trees: any = [];
    /** 节内容 */
    vhtml = '';
    /** 节标题 */
    hs: any[] = [];
    /** 右侧导航栏激活下标 */
    activeIndex: number = -1;
    /** 计时器 */
    timer!: any;
    /** 右侧导航列表点击事件是否完成 */
    isClickOver: any = true;
    constructor() {
        super();
    }

    activated() {
        this.getAsyncDataToThisInActivated();
        this.$nextTick(() => {
            this.Hljs().then(() => {
                this.getDocNav();
            });
        });
    }

    /**
     * 点击菜单树的节
     * @param e 节
     */
    navigate(e: any) {
        this.zname = e.parent.name;
        this.jname = e.name;
        this.httpRequest(DocContentService.selectOne({ id: e.id }, '/f'), {
            success: (data: any) => {
                this.vhtml = this.cleanVHtml(data.docContent.text);
                this.$nextTick(() => {
                    this.Hljs().then(() => {
                        this.getDocNav();
                    });
                })
            }
        });
    }


    /**
     * 初始化获取右侧文档标题导航model
     */
    getDocNav() {
        if (!this.doc) { return; }
        this.hs = [];
        const hs = this.doc.querySelectorAll('h1,h1~h2');
        if (!hs || !hs.length || hs.length < 2) return;
        for (let i = 0, len = hs.length; i < len; i++) {
            const h = hs[i];
            const text = h.textContent || h.innerText;
            if (!text || text.length < 2) continue;
            const id = 'doc-' + i;
            h.id = id;
            this.hs.push({
                text,
                id: id,
                index: i,
                name: h.tagName,
                scrollTop: this.getScrollValue(h)
            });
        }
        this.$$.addEvent(this.doc, 'scroll', this.onScroll);
    }

    /**
     * 滚动事件
     * @param e scroll
     */
    onScroll(e: Event) {
        // 必须等点击事件完成才能触发onscroll
        if (!this.isClickOver) return;
        const curScrollTop = this.doc.scrollTop;
        for (let i = 0, len = this.hs.length; i < len; i++) {
            const h = this.hs[i];
            if (Math.abs(h.scrollTop - curScrollTop) < 20) {
                this.activeIndex = h.index;
                return;
            }
        }
    }

    /**
     * 获取锚点对应的scrollTop值
     * @param anchor 锚点
     */
    getScrollValue(anchor: any) {
        // 计算max scrollTop
        const maxScrollTop = parseInt(this.doc.scrollHeight)
            - parseInt(this.doc.offsetHeight);
        // 计算锚点到this.doc的距离
        const doc2Top = parseFloat(this.$$.getElementRect(this.doc)['top']);
        const anc2Top = parseFloat(this.$$.getElementRect(anchor)['top']);
        const anc2doc = anc2Top - doc2Top;
        const v = anc2doc - 16; // 16：锚点定位后距离容器顶部的最小距离
        if (v < maxScrollTop) {
            return v;
        }
        return maxScrollTop;
    }

    /**
     * 点击导航标题去对应的锚点
     * @param v 导航标题model
     * @param e 事件
     */
    toAnchor(v: any, e: Event) {
        clearInterval(this.timer);
        this.isClickOver = false;
        this.activeIndex = v.index;
        const curScrollTop = this.doc.scrollTop;
        const nextScrollTop = v.scrollTop;
        // cruScrollTop -> nexScrollTop
        // 位移
        const x = nextScrollTop - curScrollTop;
        // 计划在300ms内完成,每60ms位移一次
        const dixs = x / (300 / 60);
        this.timer = setInterval(() => {
            const value = this.doc.scrollTop + dixs;
            if ((dixs > 0 && value > nextScrollTop) || (dixs < 0 && value < nextScrollTop)) {
                this.doc.scrollTop = nextScrollTop;
                clearInterval(this.timer);
                this.isClickOver = true;
                return;
            }
            this.doc.scrollTop = value;
        }, 60);
    }

    deactivated() {
        clearInterval(this.timer)
        this.$$.removeEvent(this.doc, 'scroll', this.onScroll);
    }
}