import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import $$ from '@/core/modules/util/dom-util';

@Component
export default class PartLoadingComponent extends Vue {

    /** 局部加载类型1-针对列表加载，2-针对局部文字加载 */
    @Prop({
        type: Number,
        default: 0
    })
    type!: number;

    constructor() {
        super();
    }

    get css3() {
        if (process&&process.server) return false;
        return $$.supportAnimation();
    }

}