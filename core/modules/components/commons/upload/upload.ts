import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Ref } from "vue-property-decorator";

@Component
export default class UploadComponent extends Vue {
    @Prop({default: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'})
    accept!: any;
    @Ref('file')
    input: any;
    constructor() {
        super();
    }
    mounted(): void {
        this.input.onchange = this.onchange;
    }
    onchange(e: any) {
        this.$emit('onchange', e);
    }
}