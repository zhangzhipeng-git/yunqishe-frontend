import Vue from 'vue';
import { Prop , Component, Ref, Model, Emit} from 'vue-property-decorator';

@Component
export default class SearchComponent extends Vue {
    @Prop({
        type: String,
        default: ''
    })
    @Model('input')
    /** 父组件传过来的值 */
    public value!: string;
    @Prop({
        type: String,
        default: '输入内容~'
    })
    /** 搜索框占位文本 */
    public placeholder!: string;

    constructor() {
        super();
    }

    /**
     * 输入时，把输入值发射出去
     */
    @Emit('input')
    emitInput(): string {
        return this.value;
    }

    /**
     * 点击搜索icon时，把输入值发射出去
     */
    @Emit('click')
    emitClick(): string {
        return this.value;
    }

}