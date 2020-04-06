import Vue from 'vue';
import Component from 'vue-class-component';
import {NuxtAxiosInstance} from '@nuxtjs/axios';
import ProtalIndexComponent from './protal';
const options: any = {
    layout: 'app',
    components: {
        ProtalIndexComponent
    },
    asyncData({$axios}: {$axios: NuxtAxiosInstance}) {
        
    }
}
@Component(options)
export default class AppComponent extends Vue {
    constructor() {
        super();
    }

    private mounted(): void {
        console.log('Index...');
    }
}