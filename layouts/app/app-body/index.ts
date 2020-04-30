import Vue from 'vue';
import Component from 'vue-class-component';
import $$ from '@/core/modules/util/dom-util';
@Component
export default class AppBodyComponent extends Vue {
    constructor() {
        super();
    };
    mounted() {
        // 头部随scroll改变透明度
        $$.addEvent(document.getElementById('id-app'), "scroll", this.changeOpacity);
      }
      /**
       * 移除绑定的事件
       */
      public destroyed(): void {
        $$.removeEvent(document.getElementById('id-app'), "scroll", this.changeOpacity);
      }
      /**
       * 上下滑动改变顶部透明度
       */
      private changeOpacity() {
          const header: any = document.getElementById('id-app-header');
          const scrollTop: any = (<any>document).getElementById('id-app').scrollTop;
        // x:delta 100 => opacity:delta .1
        // 如 scrollTop 0 时 opacity 1 , scrollTop 500 时 opacity .75
        // opacity = 1 - scrollTop/2000
        if (scrollTop > 500) return;
        header.style.opacity = 1 - scrollTop / 2000;
      }
    
};