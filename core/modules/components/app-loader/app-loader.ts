import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class LoaderComponent extends Vue {
    /** $el */
    static el: any;
    /** 是否存在加载 */
    static exist: boolean = false;

    constructor(o: any) {
        super();
    }

    /**
     * 添加遮罩
     */
    public static load(type: string = 'circle') {
        if (LoaderComponent.exist) return;
        if (LoaderComponent.el) {
            document.body.appendChild(LoaderComponent.el);
            LoaderComponent.exist = true;
            return;
        }
        const el = document.createElement('div');
        const mv = new LoaderComponent({el,data() {
            return {
                type
            }
        },});
        LoaderComponent.el = mv.$el;
        document.body.appendChild(mv.$el);
        LoaderComponent.exist = true;
    }

    /**
     * 移除遮罩
     */
    public static unload() {
        if (!LoaderComponent.exist) return;
        document.body.removeChild(LoaderComponent.el);
        LoaderComponent.exist = false;
    }

}