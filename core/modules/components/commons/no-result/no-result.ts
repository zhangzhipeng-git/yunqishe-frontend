import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class NoResultComponent extends Vue {
    @Prop({type: String, default: ''})
    vhtml!: string;
    constructor() {
        super();
    }

}