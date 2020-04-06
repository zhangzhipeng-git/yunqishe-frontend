/*
 * @Author: your name
 * @Date: 2020-02-28 15:47:22
 * @LastEditTime: 2020-02-29 14:47:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\core\components\commons\page-bar\page-bar.ts
 */
// @ts-nocheck
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Emit, Watch } from 'vue-property-decorator';
export interface PageInfo{
    /** 总条数 */
    total?:number;
    /** 总页数 */
    pages?:number;
    /** 当前页 */
    pageNum?:number;
    /** 每页条数 */
    pageSize?:number;
    /** 分页条导航窗口[滑动窗口]大小 */
    navPages?:number;
    /** 是否显示详情 */
    detail?:boolean;
    /** 是否显示跳转 */
    jump?:boolean;
    /** 改变每页条数的数组 */
    pageSizes?:number[]
}
@Component
export default class PageBarComponent extends Vue {
    @Prop({type: Object,default: () => {return {}}})
    pageInfo!: PageInfo;
    pageInfo$ = {
        // pageSizes:[10,20,30,40,50]
    };
    /** 侦听分页信息 */
    @Watch('pageInfo')
    watchPageInfo(nv: any) {
        const o = {};
        o.total = nv.total || 0;
        o.pages = nv.pages || 0;
        o.jump = nv.jump || false;
        o.pageNum = nv.pageNum || 1;
        o.pageSize = nv.pageSize || 5;
        o.navPages = nv.navPages || 5;
        o.detail = nv.detail || false;
        o.pageSizes = nv.pageSizes || false;
        this.pageInfo$ = o;
    }

    /** 滑动窗口 */
    window: number[] = [];
    /** 改变每页记录条数的下拉选择是否展开 */
    spread:boolean = false;
    /** 要跳的那一页 */
    to: string = '';
    /** 获取滑动窗口 */
    get slideWindow(): number[] {
        this.window = [];
        const pages = this.pageInfo$.pages;
        // 滑动窗口大小大于总页数，则滑动窗口大小等于总页数
        if(pages !== 0 && pages < this.pageInfo$.navPages) {
            this.pageInfo$.navPages = pages;
        }
        const navPages = this.pageInfo$.navPages;
        for (let i = 1; i <= navPages; i++) {
            this.window.push(i)
        }
        return this.window;
        
    };
    /** 设置滑动窗口 */
    set slideWindow(v: number[]) {
        this.window = v;
    }
    /** 获取当前页 */
    get pageNum() {
        const pages = this.pageInfo$.pages;
        // 当前页比分页总数大，则使当前页为总页数
        if(this.pageInfo$.pageNum > pages) {
            this.pageInfo$.pageNum = pages;
        }
        return this.pageInfo$.pageNum;
    }
    /** 设置当前页 */
    set pageNum(v: number) {
        this.pageInfo$.pageNum = v;
        // 同时改变滑动窗口
        const window = this.slideWindow;
        // 在滑动窗口内
        if(!window.length||window.includes(v)) return;
        const navPages = this.pageInfo$.navPages;
        // 当前页在滑动窗口左侧
        let arr = [];
        if(v<window[0]) {
            for(let i = v,len = v + navPages; i < len; i++) {
                arr.push(i);
            }
            this.slideWindow = arr;
            return;
        }
        // 当前页在滑动窗口右侧
        if(v>window[navPages]) {
            for(let i = v-navPages + 1 ; i <= v; i++) {
                arr.push(i);
            }
            this.slideWindow = arr;
        }
    }
    /** 获取反转的可改变每页大小的数组 */
    get pageSizes() {
        return (this.pageInfo$.pageSizes||[]).reverse();
    }
    /** 是否可到上一页 */
    get prev() {
        return this.pageInfo$.pageNum > 1;
    }
    /** 是否可到下一页 */
    get next() {
        const pageInfo$ = this.pageInfo$;
        return pageInfo$.pageNum < pageInfo$.pages;
    }
    /** 获取发射数据区请求api */
    get emitData() {
        const pageNum = this.pageNum;
        const pageSize = this.pageInfo$.pageSize;
        let arr = [];
        if(pageNum) {
            arr.push('pageNum='+pageNum);
        }
        if(pageSize) {
            arr.push('pageSize='+pageSize);
        }
        let qstr = arr.join('&');
        const o = {};
        o.pageNum = pageNum;
        o.pageSize = pageSize;
        o.queryStr = qstr?qstr:'';
        return o;
    }

    /** 是否显示分页条 */
    get show() {
        const pages = this.pageInfo$.pages;
        if (this.pageSizes &&  pages > 0) return true;
        if (!this.pageSizes && pages > 1) return true;
        return false;
    }

    constructor() {
        super();
    }

    /**
     * 改变每页大小
     * @param pageSize 每页大小
     */
    @Emit('toPage')
    changePageSize(pageSize: number) {
        this.spread = false;
        this.pageInfo$.pageSize = pageSize;
        return this.emitData;
    }

    /**
     * 去pageNum页
     * @param pageNum 哪一页
     */
    @Emit('toPage')
    toPage(pageNum: number){
        this.pageNum = pageNum;
        return this.emitData;
    }

    /**
     * 去上一页
     */
    toPreviousPage() {
        const pageNum = this.pageNum;
        if(pageNum <= 1) return;
        else this.pageNum = pageNum - 1;
        this.$emit('toPage', this.emitData);
    }

    /**
     * 去下一页
     */
    toNextPage() {
        const pageNum = this.pageNum;
        if(pageNum >= this.pageInfo$.pages) return;
        else this.pageNum = pageNum + 1;
        this.$emit('toPage', this.emitData);
    }

    /**
     * 跳页
     */
    go() {
        if(/\d+/.test(this.to)){
            const to = Number(this.to);
            if(to>=1&&to<=this.pageInfo$.pages) {
                this.pageNum = to;
                this.$emit('toPage', this.emitData)
                return;
            }
        }
        this.to = '';
    }
}