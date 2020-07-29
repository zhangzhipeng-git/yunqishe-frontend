import Component from 'vue-class-component';
import BaseComponent from '~/core/base-component';
import VideoComponent from '~/core/modules/components/commons/video/video.vue';
import defaultImg from "@/core/modules/filters/defaultImg";
import { Context } from '@nuxt/types';
import MediaClassService from '../../service/media-class/index';
import BannerDisposeService from '../../service/banner-dispose/index';
@Component({
    layout: 'app',
    components: {
        VideoComponent
    },
    filters: {
        defaultImg
    },
    async asyncData(context: Context) {
        if (MediaPageComponent.activated) return;
        const app = BaseComponent.getSingleton();
        app.handler.load();
        let src: string = '';
        let lists: any = [];
        await Promise.all([
            app.httpRequest(BannerDisposeService.selectList({ type: 5 }, '/f'), {context}),
            app.httpRequest(MediaClassService.selectTop2LvList({ maxSize: 8 }, '/f'), {context})
        ]).then((datas: any) => {
            const data0 = datas[0];
            const data1 = datas[1];
            const bannerDisposes = data0.bannerDisposes;
            if (bannerDisposes && bannerDisposes.length) {
                src = bannerDisposes[0].url;
            }
            const mediaClasses = data1.mediaClasses;
            if (mediaClasses && mediaClasses.length) {
                lists = mediaClasses;
            }
        });
        app.handler.unload();
        return {src, lists }
    }
})
export default class MediaPageComponent extends BaseComponent {
    src!: string;
    constructor() {
        super();
    }
    activated() {
        MediaPageComponent.activated = true;
    }
    destoryed() {
        MediaPageComponent.activated = false;
    }

}