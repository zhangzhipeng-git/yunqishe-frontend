import Vue from 'vue';
import Component from 'vue-class-component';
import ButtonComponent from '../../core/modules/components/commons/form/button/button';
import { Prop } from 'vue-property-decorator';
@Component({
    components: {
        ButtonComponent
    }
})
export default class HoverUserComponent extends Vue {
    /** 用户 */
    @Prop({default: () => {}}) user!: any;
    @Prop({default: 'unset'}) top!: string;
    @Prop({default: 'unset'}) left!: string;
    @Prop({default: 'unset'}) right!: string;
    @Prop({default: 'unset'}) bottom!: string;
    constructor() {
        super();
    }

}