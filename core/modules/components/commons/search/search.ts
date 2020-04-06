import Vue from 'vue';
import { Prop , Component, Ref, Model, Emit} from 'vue-property-decorator';

@Component
export default class SearchComponent extends Vue {
    @Prop({
        type: String,
        default: ''
    })
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

    private mounted(): void {
    }

    /**
     * 把输入值发射出去
     * @param event 输入事件
     */
    @Emit('input')
    public emitValue(event: any): string {
        return event.target.value;
    }

}