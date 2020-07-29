import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Ref } from 'vue-property-decorator';
import ThirdSource from '../../../util/js-util';
import consts from '~/core/consts';

declare const Swiper: any;
/** banner配置对象 */
export interface Img {
    /** 自增id */
    id: number;
    /** 图片src */
    url: string;
    /** 点击跳转链接 */
    href: string;
    /** 所属类型 */
    type?: number;
    /** 说明/描述 */
    description: string;
}
@Component
export default class CarouselComponent extends Vue {
    /** 图片输入列表 */
    @Prop({ default: () => [] }) imgList!: Img[];
    /** swiper选项设置 */
    @Prop({ default: null }) options: any;
    /** 宿主元素 */
    @Ref('swiper-box') box!: HTMLElement;
    /** 是否已初始化 */
    inited: boolean = false;
    /** 是否显示切换按钮 */
    showBtn: boolean = false;
    /** 图片列表长度 */
    realImgLength: number = 0;
    /** swiper实例 */
    swiper: any;
    /** 是否需要在路由激活时重新实例化,第一次进入路由时交由beforeMounted去初始化 */
    isReInstance: boolean = false;
    /** 获取swiper选项 */
    get options$() {
        return Object.assign({
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            direction: 'horizontal', // 垂直切换选项
            loop: true, // 循环模式选项
            // 如果需要分页器
            pagination: {
                el: '.swiper-pagination'
            },
            // 如果需要前进后退按钮
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                init: this.init
            }
        }, this.options);
    }

    /**
     * 挂载前
     */
    beforeMount() {
        ThirdSource.loadCss(consts.CSS_MAPS.swiper);
        ThirdSource.loadJS(consts.JS_MAPS.swiper, () => {
            if (undefined === (<any>window).Swiper) return;
            this.initSwiper();
        });
    }

    /**
     * 创建swiper实例
     */
    initSwiper() {
        this.$nextTick(() => {
            const mySwiper = new Swiper('.swiper-container', this.options$);
            this.$emit('instance', mySwiper);
            this.swiper = mySwiper;
            this.setRealImgLength();
            this.isDisableSlide(mySwiper);
        });
    }

    /**
     * 离开路由后，标记需要重新实例化
     */
    deactivated() {
        this.isReInstance = true;
    }

    /**
     * 路由激活，解决路由跳回不自动轮播的bug
     */
    activated() {
        if (!this.isReInstance) return;
        this.initSwiper();
    }

    /**
     * swiper init钩子
     */
    init() {
        this.inited = true;
    }

    /**
     * 设置图片元素列表长度
     */
    setRealImgLength() {
        this.realImgLength = this.box.getElementsByClassName('swiper-slide').length;
    }

    /**
     * 只有一张或没有图片时禁用切换和滑动
     * @param swiper 
     */
    isDisableSlide(swiper: any) {
        if (this.realImgLength > 1) return;
        // 禁止自动播放
        swiper.autoplay.stop();
        // 禁止滑动
        swiper.allowTouchMove = false;
    }

}