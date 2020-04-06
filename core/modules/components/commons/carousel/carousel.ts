import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';

@Component
export default class CarouselComponent extends Vue {
    @Prop({
        type: Array,
        default: []
    })
    /** 图片url列表 */
    public imgList!: string[];
    // ！！！父传子单向数据流，避免子直接修改父传过来的prop！！！
    @Prop({
        type: Number,
        default: 2000
    })
    /** 轮播间隔 */
    public interval!: number;
    @Prop({
        type: Number,
        default: 1000
    })
    /** 渐变时间（图片切换时间） */
    public transTime!: number;
    @Prop({
        type: String,
        default: 'transition'
    })
    /** 轮播方式 'transition' - 使用width和opacity实现, 'translate' - 使用位移实现 */
    public type!: string;
    /** 当前显示的图片索引下标 */
    public cindex: number = 0;
    /** 轮播容器父元素宽度 */
    public parentWidth: number = 0;
    /** 轮播容器父元素高度 */
    public parentHeight: number = 0;
    /** 定时器 */
    public timer: any;
    constructor() {
        super();
    }

    private mounted(): void {
        this.$nextTick(() => {
            // this.interval += this.transTime;
            this.parentWidth = parseInt(this.computedStyle(this.$refs.container, 'width'), 10);
            this.parentHeight = parseInt(this.computedStyle(this.$refs.container, 'height'), 10);
            this.start();
        });
    }

    /**
     * 停止
     * @param index 要显示的图片下标索引
     */
    public stop(index?: number) {
        if (index !== undefined) {
            this.cindex = index;
        }
        clearInterval(this.timer);
    }

    /**
     * 开始
     */
    public start() {
        // ！！！父传子单向数据流，避免子直接修改父传过来的prop！！！
        // 实践轮播间隔时间 = 渐变延时 + 图片静止时间
        const interval = this.transTime + this.interval;
        this.timer = setInterval(() => {
            this.cindex++;
            if (this.cindex >= this.imgList.length) {
                this.cindex = 0;
            }
        }, interval);
    }

    /**
     * 获取计算后的属性值
     * @param el 目标元素
     * @param key 属性
     */
    private computedStyle(el: any, key: any) {
        if (!!window.getComputedStyle) {
            return getComputedStyle(el, null)[key];
        } else {
            return el.currentStyle[key];
        }
    }

    /**
     * 去上一副图
     */
    public toPre() {
        this.stop();
        this.cindex--;
        if (this.cindex < 0) {
            this.cindex = this.imgList.length - 1;
        }
        this.start();
    }

    /**
     * 去下一幅图
     */
    public toNex() {
        this.stop();
        this.cindex++;
        if (this.cindex >= this.imgList.length) {
            this.cindex = 0;
        }
        this.start();
    }

    public destroyed() {
        clearInterval(this.timer);
    }

    /**
     * 点击图片发射事件 vote
     * @param index 当前图片下标
     */
    @Emit('vote')
    public click(index: number): number {
        return index
    }
}