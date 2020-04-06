// @ts-nocheck

import App from "~/core/context/app-context";

// 不需要登录就能访问的地址，后端对应不需要登陆就能访问的api【防盗链，设置跨域请求权限】
export const whiteList = [
  /** 前台 */
  "/login",
  "/protal",
  "/forum",
  "/wenyun",
  "/zhixng",
  "/zhixing/doc",
  "/zhixing/vid",
  /** 后台 */
  "/admin/login_for_sys"
];
// 刷新页面时，只在服务端执行。。。导致刷新页面会丢失密钥
const router = async ({ route, redirect, req, store}) => {
  const fullPath = route.fullPath;
  // 路由地址在白名单内
  const path = fullPath.split("?")[0];
  if (path && whiteList.includes(path)) return;

  const app = App.getAppContext();
  /** 登录页地址，前台为'/login',后台为'/admin/login_for_sys' */
  const login_url =
    path.indexOf("/admin") !== 0 ? "/login" : "/admin/login_for_sys";
  let config = {headers:{}};
  // 路由地址不在白名单内，需要判断是否登录
  if (process.server) {
    // server
    // 备注：使用cookie和session需要在server/index.js中额外注入
    if (store.state.user) return;
    config.headers = req.headers;
    config.headers['Cookie']='rememberMe=' + req.cookies.get('rememberMe'); 
  } else {
    // client
    // 和sotore.state.user一样，这两处都存了user，任选一个判断即可
    if (app.getDB().get("user")) return;
  }

  // 查询是否已登录或记住我，返回成功则协商密钥
  await app
    .getHttp()
    .get("/user/isrecord", config)
    .then(data => {
      if (data.status === 400) { // 失败去登录页
        redirect(login_url, { fromPath: fullPath });
        return;
      }
      const user = data.data.user;
      // node server
      if (process && process.server) {
        req.session.user = user;
        console.log(req.session.user);
        store.commit('setUser', user); // 它会混合状态到客户端！！！，所以客户端也可以取到
        return;
      }
      // client, 注意：刷新页面的时候，只在服务端执行，所以这里是没法执行的！！！
      // 在服务端登录后，会将用户混合到客户端，这个过程是客户端不可控的，即无法在混合到客户端后上送密钥，
      // 所以，可以在axios插件里添加一个拦截，在请求需要加密的接口时上送密钥，成功后取消该拦截
      // 
      // secure初始化[在登录后],因为加解密的功能在客户端完成，所以只在客户端初始化secure
      app.getSecure().secureInit();
      store.commit('setUser', user);
      app.getDB().set('user', user);
    });
};
// 看来这个是可以用异步函数的，
export default router;
