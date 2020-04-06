
/*
 * Filename: d:\frontend\vue\nuxt-ssr\pages\protal\protal.ts
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Wednesday, December 4th 2019, 10:25:32 pm
 * Author: zzp-dog
 * 门户首页
 * Copyright (c) 2019 Your Company
 */

import Vue from 'vue';
import Component from 'vue-class-component';
import CarouselComponent from '@/core/modules/components/commons/carousel/carousel.vue'
import tail from '@/assets/images/carousel-test/dail.jpg';
import eval2 from '@/assets/images/carousel-test/eval2.jpg';
import tugou from '@/assets/images/carousel-test/tugou.jpg';
import tantailang from '@/assets/images/carousel-test/tantailang.jpg';
const options: any = {
    layout: 'app',
    components: {
        CarouselComponent
    },
    asyncData() {
        
    },

}
@Component(options)
export default class ProtalIndexComponent extends Vue {

    /** 图片url列表 */
    public imgList: any[] = [];
    /** 等级颜色 */
    public rankColors: any[] = ['#ee1d24', '#ef6ea8', '#ffa500', 'gray'];
    /** 当前鼠标悬浮所在的排名文章 */
    public rankIndex: number = - 1;
    /** 当前鼠标悬浮所在的推荐文章 */
    public recommendIndex: number = - 1;
    /** 当前鼠标悬浮所在的UP */
    public upIndex: number = - 1;

    constructor() {
        super();
    }


    public mounted(): void {
        this.imgList = [
            tail,
            eval2,
            tantailang,
            tugou,
        ]
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
    private log(index: number) {
        console.log(index);
    }
}