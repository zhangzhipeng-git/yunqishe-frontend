/**
 * vuex
 */
import App from "~/core/context/app-context";
export const state = () => ({
  user: null
})
  
export const mutations = {
  /** 设置用户简易信息 */
  setUser(state, user) {
    state.user = user;
  }
}

export const actions = {
  // 在服务端执行，且在route.js前执行
  async nuxtServerInit({ commit}, { req }) {
    await App.getAppContext().getHttp().get("/user/isrecord", {headers: req.headers}).then(data => {
        if (data.status !== 200) { // 失败去登录页
            return;
        }
        const user = data.data.user;
        commit('setUser', user);
    });
  }
}
