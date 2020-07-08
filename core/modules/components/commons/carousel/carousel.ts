import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import ThirdSource from '../../../util/js-util';
import consts from '~/core/consts';

declare const Swiper: any;
@Component
export default class CarouselComponent extends Vue {
    /** 图片输入列表 */
    @Prop({default: []}) imgList: any;
    /** swiper选项设置 */
    @Prop({default: null}) options: any;
    /** 是否已初始化 */
    inited: boolean = false;
    /** 是否显示切换按钮 */
    showBtn: boolean = false;
    /** 获取swiper选项 */
    get options$() {
        return Object.assign({
            autoplay: {
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
                init: () => {
                    this.inited = true;
                }
            }
          }, this.options);
    }

    beforeMount() {
        ThirdSource.loadCss(consts.CSS_MAPS.swiper);
        ThirdSource.loadJS(consts.JS_MAPS.swiper, () => {
            this.$nextTick(() => {
                const mySwiper = new Swiper ('.swiper-container', this.options$)        
            });
        });
    }
}