/*
* Filename: d:\frontend\vue\nuxt-ssr\pages\learn\doc-detail\_id.ts
* Path: d:\frontend\vue\nuxt-ssr
* Created Date: Saturday, December 28th 2019, 5:24:11 pm
* Author: zzp-dog
* 文档详情
* Copyright (c) 2019 Your Company
*/
import Vue from 'vue';
import Component from 'vue-class-component';
import SideMenuComponent from '@/core/modules/components/commons/side-menu/side-menu.vue';
import EditorComponent from '@/core/modules/components/commons/editor/editor.vue';
import SidebarNavComponent from '@/core/modules/components/projections/sidebar-nav/sidebar-nav.vue';
const options = {
    layout: 'app',
    components: {
        SidebarNavComponent,
        SideMenuComponent,
        EditorComponent
    }
}
@Component(options)
export default class DetailComponent extends Vue {
    constructor() {
        super();
    }

    private mounted(): void {
    }
    recieveContent(e: any) {
        console.log(e);
    }
}