import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Ref } from "vue-property-decorator";

@Component
export default class UploadComponent extends Vue {
    @Prop({default: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'})
    accept!: any;
    /** 是否显示button */
    @Prop({default: false})hasBtn!: boolean;
    /** file文本 */
    @Prop({default: '上传'})text!: string;
    /** 是否禁用 */
    @Prop({default: false})disabled!: boolean;
    /** file input */
    @Ref('file')input: any;
    /** 重建 */
    rebuild: boolean = true;

    constructor() {
        super();
    }

    onchange(e: any) {
        this.$emit('onchange', e);
        this.rebuild = false;
        setTimeout(() => {this.rebuild = true});
    }
}