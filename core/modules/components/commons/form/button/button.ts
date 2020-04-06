/*
 * @Author: your name
 * @Date: 2020-02-02 15:12:39
 * @LastEditTime: 2020-02-16 16:13:02
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\components\commons\form\button\button.ts
 */
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Component
export default class ButtonComponent extends Vue {
    /** 给button添加的类名 */
    @Prop({
        type: String,
        default: ''
    })
    btnclz!: string;
    /** 是否禁用 */
    @Prop({
        type: Boolean,
        default: false
    })
    disabled!: boolean;
    disabled_: boolean = false;
    /** 节流间隔 */
    @Prop({default:1000})
    throttleTime!: number;
    /** 按钮文字 */
    @Prop({type: String, default:''})
    text!: string;

    constructor() {
        super();
    }

    public emitClick(e: Event): void {
        if(this.disabled_) return;
        this.disabled_ = true;
        setTimeout(() => {
            this.disabled_ = false
        }, this.throttleTime);

        this.$emit('click');
    }

    @Watch('disabled', {immediate: true})
    public watchDisabled() {
        this.disabled_ = this.disabled;
    }
}