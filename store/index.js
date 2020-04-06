// @ts-nocheck
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
  nuxtServerInit({ commit}, { req }) {
    
  }
}
