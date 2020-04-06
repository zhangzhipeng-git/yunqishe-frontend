/*
 * @Author: your name
 * @Date: 2020-01-07 21:18:15
 * @LastEditTime : 2020-01-08 23:51:40
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\components\commons\editor\_form\radio\radio.ts
 */
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Model, Emit} from 'vue-property-decorator';

@Component({data(){return {vmodel: (<any>this).model}}})
export default class RadioGroupComponent extends Vue {
    /** v-model */
    @Prop()
    @Model('change')
    model: any;
    /** radio配置数组 */
    @Prop({type: Array, default: () => []})
    list!: any[];
    /** 是否禁用radio组 */
    @Prop({type:Boolean,default: false})
    disabled!: boolean;
    /** list数组元素的标志如id */
    @Prop({type:String,default:'id'})
    key$!:string;
    /** list数组元素的value */
    @Prop({type:String,default:'description'})
    value$!:string;
    /** 当前点击的radio的下标  */
    activeIndex: number = -1;
    /** 获取id前缀 */
    get idPrefix() {
        return 'zx'+ (<any>this)._uid;
    }
    constructor() {
        super()
    }
    mounted() {
        for(let i = 0, len = this.list.length; i < len; i++) {
            if (this.list[i][this.key$] === this.model)
            this.activeIndex = i;
        }
    }
    /**
     * 发射chagne事件
     * @param v radio的value
     */
    @Emit('change')
    emitChange(v: any) {
        return v;
    }
    /**
     * 当前点击的radio激活
     * @param i 当前点击的radio的下标
     */
    getActiveIndex(i: number): void {
        this.activeIndex = i;
    }
}
/** 单个radio的配置 */
export interface Radio {
    disabled?: boolean;
    [key:string]:any;
}