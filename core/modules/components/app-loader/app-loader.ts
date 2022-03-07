import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class LoaderComponent extends Vue {
    /** $el */
    static el: any;
    /** 是否存在加载 */
    static exist: boolean = false;
    /** 是否有定時器 */
    static timer: NodeJS.Timeout;

    constructor (o: any) {
      super()
    }

    public static timeoutUnLoad () {
      LoaderComponent.timer = setTimeout(() => {
        LoaderComponent.unload()
      }, 10 * 1000)
    }

    /**
     * 添加遮罩
     */
    public static load (type: string = 'circle') {
      if (LoaderComponent.exist) { return }
      if (LoaderComponent.el) {
        LoaderComponent.timeoutUnLoad()
        document.body.appendChild(LoaderComponent.el)
        LoaderComponent.exist = true
        return
      }
      LoaderComponent.timeoutUnLoad()
      LoaderComponent.exist = true
      const el = document.createElement('div')
      const mv = new LoaderComponent({ el,
        data () {
          return {
            type
          }
        } })
      LoaderComponent.el = mv.$el
      document.body.appendChild(mv.$el)
    }

    /**
     * 移除遮罩
     */
    public static unload () {
      if (LoaderComponent.timer) { clearTimeout(LoaderComponent.timer) }
      if (!LoaderComponent.exist) { return }
      document.body.removeChild(LoaderComponent.el)
      LoaderComponent.exist = false
    }
}
