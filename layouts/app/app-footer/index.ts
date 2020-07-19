import Vue from 'vue';
import Component from 'vue-class-component';
import Live2dComponent from '../../../core/modules/components/live2d/index';

@Component({components: {Live2dComponent}})
export default class AppFooterComponent extends Vue {

    constructor() {
        super();
    }
}