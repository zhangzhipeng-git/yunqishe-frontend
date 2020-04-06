/*
 * @Author: your name
 * @Date: 2019-12-15 22:41:14
 * @LastEditTime: 2020-01-05 16:35:53
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\layouts\app.ts
 */
import Vue from 'vue';
import Component from 'vue-class-component';
import AppHeaderComponent from '@/layouts/app-header/app-header.vue';
import AppBodyComponent from '@/layouts/app-body/app-body.vue';
import AppFooterComponent from '@/layouts/app-footer/app-footer.vue';

@Component({
    components: {
        AppHeaderComponent,
        AppBodyComponent,
        AppFooterComponent
    }
})
export default class AppComponent extends Vue {
    constructor() {
        super();
    }

    private mounted(): void {
        // 获取主题
        document.body.className = 'r';
    }


}
