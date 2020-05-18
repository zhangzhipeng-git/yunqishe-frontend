import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Model, Watch } from 'vue-property-decorator';

@Component
export default class SwitchComponent extends Vue {
    
    /** v-model */
    @Prop({default: 0})
    @Model('click')
    v!: number|boolean|string;
    /** 开关控制 */
    v$: boolean = false;

    constructor() {
        super();
    }

    @Watch('v', {immediate: true})
    watchModel(nv: any) {
        if (nv === undefined || nv === null) {
            this.$emit('click', false);
        }
        this.v$ = !!nv;
    }

    switch$() {
        this.v$ = !this.v$;
        let v;
        if (typeof this.v === 'boolean') {
            v = this.v ? false : true;
        } else if (typeof this.v === 'number'){
            v = this.v === 0 ? 1 : 0;
        }
        this.$emit('click', v);
    }

}