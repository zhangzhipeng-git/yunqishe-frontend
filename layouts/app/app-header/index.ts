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
    // 请求是否已登录或记住我
    this.isRecord();
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
   * 去用户中心
   */
  goUserCenter() {
    if (!this.curUser||!this.curUser.id) {
      this.toLogin();
      return;
    }
    this.$router.push('/user?id='+this.curUser.id);
  }

  /**
   * 去搜索
   */
  public toSearch() {
    console.log(this.searchText);
  }
}
