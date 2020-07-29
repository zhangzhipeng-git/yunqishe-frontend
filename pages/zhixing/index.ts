import Component from 'vue-class-component';
import BaseComponent from '@/core/base-component.ts';
import { Context } from '@nuxt/types';
import DocClass from '../../service/doc-class/index';
import BannerDisposeService from '../../service/banner-dispose/index';

const options={
    layout: 'app',
    async asyncData(context: Context) {
        if (ZXComponent.activated) return;
        const app = BaseComponent.getSingleton();
        app.handler.load();
        let list: any = [];
        let banner0: any = {};
        await Promise.all([
            app.httpRequest(DocClass.selectTop2LvList('/f'), {context}),
            app.httpRequest(BannerDisposeService.selectList({type: 4}, '/f'),{context})
        ]).then((datas: any) => {
            const data0 = datas[0];
            const data1 = datas[1];
            list = data0.docClasses;
            banner0 = data1.bannerDisposes[0];
            app.cleanVHtml(banner0.description);
        });
        app.handler.unload();
        return {list, banner0};
    }
}
@Component(options)
export default class ZXComponent extends BaseComponent {
    list: any[] = [];
    constructor() {
        super();
    }
    activated() {
        ZXComponent.activated = true;
    }
    destoryed() {
        ZXComponent.activated = false;
    }
}