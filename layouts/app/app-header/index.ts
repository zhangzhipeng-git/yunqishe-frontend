/*
 * @Author: your name
 * @Date: 2019-12-15 22:41:14
 * @LastEditTime: 2020-03-23 16:02:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\layouts\app-header\app-header.ts
 */
import Component from "vue-class-component";
import BaseComponent from "~/core/base-component";
import SearchComponent from "@/core/modules/components/commons/search/search.vue";
import SwitchComponent from '../../../core/modules/components/commons/form/switch/switch';
import Live2dComponent from '../../../core/modules/components/live2d/index';

@Component({
  components: {
    SearchComponent,
    SwitchComponent,
    Live2dComponent
  }
})
export default class AppHeaderComponent extends BaseComponent {
  public searchText: string = "";
  /** 是否显示主题设置 */
  showPageSet: any = false;
  /** 头部或底部背景色: 1-#202223, 0-white */
  bg: any = '';
  /** 主题色 */
  theme: any = '';

  get hasLogin(): boolean {
    if (process&&process.server) return false;
    return this.curUser&&this.curUser.id;
  }

  get img() {
    if (this.curUser) return this.curUser.avator;
    return '';
  }

  constructor() {
    super();
  }

  public beforeMount() {
    // 请求是否已登录或记住我
    this.isRecord();
    
    this.bg = this.localStorage.getItem('bg')||0;
    this.theme = this.localStorage.getItem('theme')||'r';
    this.showPageSet = this.localStorage.getItem('pageSet')||false;
    const header: any = document.getElementById('id-app-header');
    const footer: any = document.getElementById('id-app-footer');
    header&&(header.className = this.bg === 1?'dark':'');
    footer&&(footer.className = this.bg=== 1?'dark':'');
    document.body.className = this.theme;
  }

  /**
   * 登出
   */
  logout(): void {
    // 清除session登陆状态和rememberMe
    this.httpRequest(this.http.get("/user/logout"), {
      success: () => {
        this.doLogout();
      },
      error: () => {
        this.doLogout();
        return true;
      }
    });
  }

  /**
   * 登出成功后去登录页
   */
  doLogout() {
    this.$store.commit("setUser", null);
    // 去登录页
    this.$router.push({
      path: "/login",
      query: {
        fromPath: this.$route.fullPath
      }
    });
  }

  /**
   * 登录去登录页
   */
  login() {
    let path = '';
    let fromPath = decodeURIComponent(this.$route.fullPath);
    // 从其他页跳到登录页的（登录页也可以点登录）
    if (fromPath.indexOf('fromPath')>-1) {
      fromPath = fromPath.split('fromPath=')[1];
    }
    path = '/login?fromPath='+fromPath;
    this.$router.push({
      path
    })
  }

  /**
   * 去用户中心
   */
  goUserCenter() {
    if (!this.curUser||!this.curUser.id) {
      this.toLogin('/user');
      return;
    }
    this.$router.push('/user?id='+this.curUser.id);
  }

  /**
   * 去搜索
   */
  public toSearch() {
    this.handler.toast({text:'暂未实现~'});
  }

  /**
   * 隐藏和显示设置主题样式的下拉框
   */
  togglePageSet() {
    this.showPageSet = !this.showPageSet;
    this.localStorage.setItem('pageSet', this.showPageSet);
  }

  /**
   * 改变头部/底部背景色
   * @param {number} 1- #202223, 0- white;
   */
  changeBg(v: number) {
    const header: any = document.getElementById('id-app-header');
    const footer: any = document.getElementById('id-app-footer');
    header&&(header.className = v === 1?'dark':'');
    footer&&(footer.className = v === 1?'dark':'');
    this.localStorage.setItem('bg', v);
  }

  /**
   * 选择主题
   * @param v 主题对象
   */
  chooseTheme(v: any) {
    document.body.className = v.clz;
    this.theme = v.clz;
    this.localStorage.setItem('theme', this.theme);
  }

}
