import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import BaseComponent from '~/core/base-component';
import NoResultComponent from '@/core/modules/components/commons/no-result/no-result.vue';
import SidebarComponent from '@/core/modules/components/projections/sidebar/sidebar.vue';
@Component({layout: 'app-nofooter',components: {NoResultComponent,SidebarComponent}})
export default class UserComponent extends BaseComponent {
    activeIndex: number = 0;
    /** user页面 */
    @Ref('user_center')
    userCenter!:any;

    constructor() {
        super();
    }
    public active(i: number): void {
        this.activeIndex = i;
    }
    public mounted(){
        // 计算并设计user页面实际高度
        (<any>this.userCenter).style.height = document.body.offsetHeight + 'px';
    }
}