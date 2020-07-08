
/*
 * Filename: d:\frontend\vue\nuxt-ssr\pages\protal\protal.ts
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Wednesday, December 4th 2019, 10:25:32 pm
 * Author: zzp-dog
 * 门户首页
 * Copyright (c) 2019 Your Company
 */

import Component from 'vue-class-component';
import CarouselComponent from '@/core/modules/components/commons/carousel/carousel.vue'
import BaseComponent from '../../core/base-component';
import strCut from '../../core/modules/filters/strCut';
import SelectComponent from '../../core/modules/components/commons/form/select/select';
const options: any = {
    layout: 'app',
    components: {
        CarouselComponent,
        SelectComponent
    },
    filters: {
        strCut
    },
    async asyncData(context: any) {
        const app = BaseComponent.getSingleton();
        let imgList = <any>null;
        await app.httpRequest(app.http.get('/imageDispose/f/select/list?type=1'), {
            success: (data: any) => {
                imgList = data.imageDisposes;
            }
        }, context);
        const o = {imgList};
        app.setAsyncData(o);
        return o;
    },
}
@Component(options)
export default class ProtalIndexComponent extends BaseComponent {

    /** 图片url列表 */
    public imgList!: any;
    /** 当前鼠标悬浮所在的排名文章 */
    public rankIndex: number = - 1;
    /** 当前鼠标悬浮所在的推荐文章 */
    public recommendIndex: number = - 1;
    /** 当前鼠标悬浮所在的UP */
    public upIndex: number = - 1;

    /** 是否推荐内容展开 */
    isOpen1: boolean = false;
    /** 是否up主展开 */
    isOpen2: boolean = false;
    /** 性别类型,1-全部，1-男，2-女，3-未知 */
    sex: number = -1;
    /** 性别列表 */
    sexList: any[] = [
        {id: -1, description: "全部"},
        {id: 1, description: "男生"},
        {id: 2, description: "女生"},
        {id: 3, description: "未知"},
    ];

    constructor() {
        super();
    }


    activated(): void {
        Object.assign(this, this.getAsyncData());
    }

    /**
     * 显示底部信息
     * @param index 鼠标悬浮所在文章索引下标
     */
    public showRankUpInfo(index: number) {
        this.rankIndex = index;
    }

    /**
     * 隐藏底部信息
     */
    public hideRankUpInfo() {
        this.rankIndex = -1;
    }

    /**
     * 显示遮罩
     * @param n 近期推荐作品索引下标
     */
    public showRecommendMask(n: number) {
        this.recommendIndex = n;
    }

    /**
     * 隐藏
     */
    public hideRecommendMask() {
        this.recommendIndex = -1;
    }

    /**
     * 隐藏信息
     */
    public hideUpInfo() {
        this.upIndex = -1;
    }

    public showUpInfo($event: Event, n: number) {
        this.upIndex = n;
    }

    /**
     * 点击轮播图
     */
    private voteImg(item: any) {
        console.log(item);
    }
}