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

@Component({
  components: {
    SearchComponent
  }
})
export default class AppHeaderComponent extends BaseComponent {
  public searchText: string = "";
  get hasLogin(): boolean {
    return this.$store.state.user;
  }
  constructor() {
    super();
  }

  /**
   * 向vuex提交登录状态
   * @param status true-已登录，false-未登录
   */
  private commitUser(user: any): void {
    this.$store.commit("setUser", user);
  }
  public beforeMount() {
    // 判断用户是否在登录状态,这里一定要用store来判断，
    // 因为刷新页面是会认证用户并混合到客户端store里的，而不会放到全局的this.db中
    const user = this.$store.state.user;
    if(user) {
        this.commitUser(user);
        return;
    }
    // 请求是否已登录或记住我
    this.httpRequest(this.http.get("/user/isrecord"), {
      success: (data: any) => {
        this.db.set('user', data.user);
        this.commitUser(data.user);
      },
      error: () => {
        this.db.set("user", null);
      }
    });
  }

  /**
   * 登出
   */
  public logout(): void {
    // 未登录
    if (!this.cookie.get("rememberMe")) {
      this.doLogout();
    }
    // 上送token清除session登陆状态和数据库token
    this.httpRequest(this.http.get("/user/logout"), {
      success: () => {
        this.doLogout();
      },
      error: () => {
        // token可能解密失败
        this.doLogout();
        return true;
      }
    });
  }

  /**
   * 登出后去登录页
   */
  private doLogout() {
    this.commitUser(null);
    this.db.set("user", null);
    // 去登录页
    this.$router.push({
      path: "/login",
      query: {
        fromPath: this.$route.fullPath
      }
    });
  }

  /**
   * 去搜索
   */
  public toSearch() {
    console.log(this.searchText);
  }
}
