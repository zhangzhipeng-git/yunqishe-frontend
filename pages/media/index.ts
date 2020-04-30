import Component from 'vue-class-component';
import BaseComponent from '~/core/base-component';
import mediaComponent from '~/core/modules/components/commons/video/video.vue';
import defaultImg from "@/core/modules/filters/defaultImg";
import { Context } from '@nuxt/types';
@Component({
    layout:'app',
    components: {
        mediaComponent
    },
    filters:{
        defaultImg
    },
    async asyncData(context: Context) {
        let lists: any = [];
        const util = BaseComponent.getSingleton();
        /** 每个分类最多查8条 */
        await util.httpRequest(util.http.get('/mediaClass/f/select/top2lv/list?maxSize=8'), {
            success: (data: any) => {
                lists = data.mediaClasses;
            }
        },context); 
        return {lists}
    }
})
export default class mediaPageComponent extends BaseComponent {
    src: string = 'https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-momedia/12695784_90e1c4a4617e64095707cc7928d940c4_bf8cdae17985.mp4';
    constructor() {
        super();
    }
    
}