
/*
* Filename: d:\frontend\vue\nuxt-ssr\components\commons\filter-spread\filter-spread.ts
* Path: d:\frontend\vue\nuxt-ssr
* Created Date: Sunday, December 22nd 2019, 1:30:49 pm
* Author: zzp-dog
* 展开式过滤器
* Copyright (c) 2019 Your Company
*/

import Vue from 'vue';
import DomUtil from '../../../util/dom-util';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Component
export default class FilterSpreadComponent extends Vue {

    /** 输入分类 列表 */
    // concern + recommend = all + 默认分类
    @Prop({
        type: Object,
        default: function () {
            return {
                concern: [ // 用户关注
                    { id: 1, name: '全站', pid: 2 },
                    { id: 2, name: '分类0', pid: 2 },
                    { id: 3, name: '分类1', pid: 2 },
                    { id: 4, name: '分类2', pid: 2 },
                ],
                recommend: [ // 推荐
                    { id: 5, name: '分类5', pid: 2 },
                    { id: 8, name: '分类8', pid: 2 },
                    { id: 7, name: '分类7', pid: 2 },
                    { id: 6, name: '分类6', pid: 2 }
                ]
            }
        }
    })
    classify!: Classify;
    /** 复制classify */
    copy_classify: any = {};
    /** 是否展开 */
    isSpread: boolean = false;
    /** 激活下标 */
    activeIndex: number = 0;
    // moveEvent: any;
    /** 最大分类数 : 8*/
    MAX_NUM = 8;
    /** 根字体大小 */
    rsize!: number;
    /** 用户必须有一个默认分类，它的下标 - 0，该分类不可取关和拖动 */
    DEFAULT_CLASS_INDEX = 0;
    /** 全站 */
    static DEFAULT_CLASS = {id: -1, name: '全部'};

    constructor() {
        super();
    }

    @Watch('classify', {immediate: true})
    public watchClassify(nv: any) {
        this.copy_classify = this.copy(nv||{});
        const c_c = this.copy_classify;
        const d_c = FilterSpreadComponent.DEFAULT_CLASS;
        if (!c_c.concern || !c_c.concern.length) {
            this.$set(c_c, 'concern', [d_c]);
        } else if (c_c.concern[0].id !== -1) {
            c_c.concern.unshift(d_c);
        }
        // 最多只能排列8个分类，即所有分类最多为8个
        // 父组件应控制好
        let clen = 0;
        let rlen = 0;
        if (c_c.concern) {
            clen = c_c.concern.length || 0;
        }
        if (c_c.recommend) {
            rlen = c_c.recommend.length || 0;
        }
        if (clen + rlen > this.MAX_NUM) {
            console.warn('filter-spread组件超过8个分类！！！');
        }
    }

    mounted(): void {
        this.rsize = parseFloat(DomUtil.getcomputedStyle(document.body, 'fontSize'));
    }

    // 收起或关闭
    action() {
        this.isSpread = !this.isSpread;
    }

    /**
     * 展开时取消关注或关闭时选择该分类
     * @param $e 事件
     * @param e 被点击分类
     * @param i 分类下标
     */
    selectConcern($e: any, e: any, i: number) {
        if (!this.isSpread) { // 关闭时，发射选择的分类
            if (this.activeIndex !== i) {
                this.activeIndex = i;
                this.$emit('selectConcern', e);
            }
        }
    }

    /**
     * 关注某个分类
     * @param e 添加分类到关注
     */
    addToConcern(e: any) {
        let find_e;
        const recommend = this.copy_classify.recommend;
        for (let i = 0, len = recommend.length; i < len; i++) {
            const _e = recommend[i];
            if (e.id === _e.id) {
                find_e = recommend.splice(i, 1)[0];
                break;
            }
        }
        this.copy_classify.concern.push(find_e);
    }

    /**
     * 取消，修改并点击确认后，如果不重新传入改变后的classify，则确认操作表现为失败！！！
     */
    cancel() {
        this.activeIndex = 0;
        this.copy_classify = this.copy(this.classify);
        this.isSpread = false;
        // 若在此前修改并点击了确定，请确保重新传入prop！！！
    }

    /**
     * 发射可能被修改的分类对象
     */
    confirm() {
        this.isSpread = false;
        // 关注的只有全站则不发射
        if (this.copy_classify.concern.length === 1 && 
            this.copy_classify.concern[0].name === '全站'
        ) {
            return;
        }
        // 未进行修改也不发射
        if (this.equals(this.copy_classify, this.classify)) {
            // 未修改，不发射被修改分类
            return;
        }
        // 发射关注的分类id
        const arr: any = [];
        this.copy_classify.concern.forEach((e: any) => {
            if (e.id !== -1 && e.id !== null) {
                arr.push(e.id);
            }
        })
        this.$emit('confirm', arr);
    }

    /**
     * 深复制对象
     * @param obj 被深复制对象
     */
    copy(obj: object) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * 比较a和b的内容是否相等
     * @param a
     * @param b
     * @returns {boolean} true a，b内容相等，false a，b内容不等
     */
    equals(a: any, b: any): boolean | undefined{
        // 比较值，地址值
        if (a === b)  return true;
        if ((a === null && b === undefined) || (a === undefined || b === null)) return true;
        // 比较内容
        if (typeof a === 'object' && typeof b === 'object') { // 如果是引用
            const aks = Object.keys(a);
            const bks = Object.keys(b);
            if (aks.length !== bks.length) { // 自身键的长度不等
                return false;
            } else if (aks.length === 0) { // 自身键的长度都等于0
                // 形如 a = [], b = []; 或 a = {}， b = {} 算作相等
                if ((a instanceof Array && b instanceof Array) || (a !instanceof Array && b !instanceof Array)) {
                    return true;
                } else {
                    return false;
                }
            }
            // 遍历值并递归
            let r: any = !0; // 确保每个都是内容相等才返回true
            for ( let i = 0, len = aks.length; i < len; i++ ) {
                const ak = aks[i];
                const bk = bks[i];
                if (ak !== bk) return false;
                r = r && this.equals(a[ak], b[bk]);
            }
            return r;
        } else { // 两个都不是引用并且地址值不等
            return false;
        }
    }

    /**
     *
     * @param e 事件
     * @param i 一行最多8个，被点击元素处于第i-1个
     */
    startSort(e: any, i: number) {
        /**
         *  一、clientX、clientY
         *  点击位置距离当前body可视区域的x，y坐标
         *
         *  二、pageX、pageY
         *  对于整个页面来说，包括了被卷去的body部分的长度
         *
         *  三、screenX、screenY
         *  点击位置距离当前电脑屏幕的x，y坐标
         *
         *  四、offsetX、offsetY
         *  相对于带有定位的父盒子的x，y坐标
         *
         *  五、x、y
         *  和screenX、screenY一样
         */
        // 这里我们使用相对位移进行运算，所以不管取哪一种坐标，对计算结果不会产生影响

        // 起始点
        if (!this.isSpread) return;
        const point = {
            sx: e.pageX || e.clientX,
            sy: e.pageY || e.clientY
        }
        const _this = e.currentTarget || e.srcElement;
        // 默认分类不可移动
        const top = _this.style.top;
        const left = _this.style.left;
        _this.sortIndex = i;
        if (_this.sortIndex === this.DEFAULT_CLASS_INDEX) { // 点击了默认的那个分类返回
            return;
        }
        _this.spoint = point;
        _this.style.cssText = 'position:relative;z-index:2;top:'
        + (top || '0px') + ';left:' + (left || '0px') + ';';
        // 相对距离
        _this.disxy = {
            disx: point.sx - parseFloat(_this.style.left),
            disy: point.sy - parseFloat(_this.style.top)
        }

        // 阻止click事件, 添加遮罩，mouseup事件中移除遮罩
        if(_this.children.length === 1) {
            const mask = document.createElement('div');
            mask.style.cssText = 'position:absolute;width:100%;height:100%;top:0;left:0';
            _this.appendChild(mask);
        }
        // 绑定事件
        window.onmouseup = this.mouseup.bind(null, _this);
        window.onmousemove = this.mousemove.bind(null, _this);
    }

    /**
     * 移动
     */
    mousemove(_this: any, e: any) {
        // 中间点
        const point = {
            mx: e.pageX || e.clientX,
            my: e.pageY || e.clientY
        }
        _this.style.top =  (point.my - _this.disxy.disy) + 'px';
        _this.style.left = (point.mx - _this.disxy.disx) + 'px';
    }

    /**
     * 停止移动
     */
    mouseup(_this: any, e: any) {
        if (_this.children.length === 2) { // 移除遮罩
            _this.removeChild(_this.children[1]);
        }
        _this.style.zIndex = 0;
        window.onmouseup = null;
        window.onmousemove = null;
        // 被点击元素的高度和宽度
        const cw = _this.offsetWidth;
        const ch = _this.offsetHeight;
        const margin = .5 * this.rsize;
        // 分类标签-包含外边距的高宽
        const mcw = cw + 2 * margin;
        const mch = ch + 2 * margin;
        // 父容器高度和宽度
        /** 父容器高度 */
        const pw = _this.parentNode.clientWidth;
        /** 父容器宽度 */
        const ph = _this.parentNode.clientHeight;
        // 被点击元素的相对于自身的位移
        const top = parseFloat(_this.style.top);
        const left = parseFloat(_this.style.left);

        // 计算被点击元素行列下标
        const rowIndex = ~~(_this.sortIndex / this.MAX_NUM);
        const colIndex = ( _this.sortIndex % this.MAX_NUM );
        // 计算被点击元素左上角相对于父容器左上角的位移
        const disx = colIndex * mcw + left;  // 每一个分类元素均占父元素4.5rem宽度
        const disy = rowIndex * mch + top;   // 每一个分类元素均占父元素3rem高度

        // 计算被点击元素的上下左右边界距离父容器左上角的位移
        const rec = {
            left: disx,
            top: disy,
            right: disx + cw  +  2 * margin, // 包含左右外边距
            bottom: disy + ch +  2 * margin  // 包含上下外边距
        }

        // 关注分类个数
        const num = this.copy_classify.concern.length;
        /**
         * 从左到右依次排满，在换行排列
         * mrow = 3
         * 
         * mcol = 2
         * 
         * | 2 | 3 | 4 |
         * 
         * | 2 | 3 | 4 |
         * 
         * | 2 | 3 | 4 |
         * 
         * | 1 | 2 |
         * 
         * mrow = 0
         * 
         * mcol = 2
         * 
         * | 2 | 3 |
         */
        const mrow = Math.floor(num / this.MAX_NUM);
        const mcol = num - mrow * this.MAX_NUM;

        // 被点击元素的中心距离父容器左上角的坐标
        const center = {
            y: (rec.top + rec.bottom) / 2,
            x: (rec.left + rec.right) / 2
        }
        // 判断是否要取消关注，拖到了推荐分类的区域内，并且要清除样式！！
        if (rec.top > (mrow + 1) * ph && rec.top < (3 + (mrow + 1)) * mch && rec.right < pw && rec.left > 0) {
            // 聚焦的分类不可拖到下方的推荐分类中
            if (_this.sortIndex === this.activeIndex) {
                this.resetPosition(_this);
                return;
            }
            this.subConcern(_this.sortIndex);
            _this.style.cssText = 'position:static;top:0;left:0;'
            return;
        }
        // 判断是否落在标签上
        if (
            !(  // 不在父容器中
                center.x < pw - margin && center.x > margin
                &&
                center.y < ph - margin && center.y > margin
            )
            ||
            (   // 空白的部分，该部分没有排列标签
                center.x > mcol * mcw && center.x < pw
                &&
                center.y > mrow * mch && center.y < ph
            )
        ) {
            this.resetPosition(_this);
            return;
        }
        // 剩下的区域中有分类标签
        const col_num = ~~(center.x / mcw);
        const row_num = ~~(center.y / mch);
        const rest_x = center.x - col_num * mcw;
        const rest_y = center.y - row_num * mch;
        if ( // 中心没有落在某个标签上
            !(
                rest_x > margin && rest_x < mcw + margin
                &&
                rest_y > margin && rest_y < mch + margin
            )
        ) {
            this.resetPosition(_this);
            return;
        }
        // 找到要交换的标签的行和列
        const col_count = col_num + 1;
        const row_count = row_num + 1;
        const index = (row_count - 1) * this.MAX_NUM + col_count - 1;
        if (index === this.DEFAULT_CLASS_INDEX) { // 不可与默认分类交换
            this.resetPosition(_this);
            return;
        }
        if (index === _this.sortIndex) { // 排除自己的位置
            this.resetPosition(_this);
            return;
        }

        // 交换元素，交换关注分类中的顺序
        const ctarget = this.copy(this.copy_classify.concern[index]);
        const dtarget = this.copy_classify.concern.splice(_this.sortIndex, 1, ctarget)[0];
        this.copy_classify.concern.splice(index, 1, dtarget);
        // 聚焦不交换！
        if (_this.sortIndex === this.activeIndex) {
            this.activeIndex = index;
        } else if (index === this.activeIndex) {
            this.activeIndex = _this.sortIndex;
        }
        this.resetPosition(_this);
    }

    /**
     * 取消关注分类下标
     * @param i 取消关注分类下标
     */
    subConcern(i: number) {
        const e = this.copy_classify.concern[i];
        // 点的是第一个或只剩下一个了，则返回
        if (i === this.DEFAULT_CLASS_INDEX || this.copy_classify.concern.length === 1) {
            return false;
        }
        let find_e;
        /** 已关注分类 */
        const concern = this.copy_classify.concern;
        for (let i = 0, len = concern.length; i < len; i++) {
            const _e = concern[i];
            // 移除该分类到推荐区
            if (e.id === _e.id) {
                find_e = concern.splice(i, 1)[0];
                if (this.activeIndex > i){ // 聚焦前面的分类移除时，聚焦的index也要前移
                    this.activeIndex--;
                }
                break;
            }
        }
        this.copy_classify.recommend.push(find_e);
    }

    /**
     * 重置元素位置
     * @param e 元素
     */
    resetPosition(e: any) {
        e.style.top = '0';
        e.style.left = '0';
    }
}
/**
 * 分类对象
 */
interface Classify {
    concern: any[],
    recommend: any[]
}