// @ts-nocheck

import App from "~/core/context/app-context";

// 不需要登录就能访问的页面
export const whiteList = [
    /** 前台 */
    "/user",
    "/login",
    "/protal",
    "/circle",
    "/circle/content",
    "/circle/detail",
    "/qa",
    "/qa/detail",
    "/zhixing",
    "/zhixing/detail",
    "/media",
    "/media/detail",
    /** 后台 */
    "/admin/login_for_sys"
];
// 刷新页面时，只在服务端执行。。。导致刷新页面会丢失密钥
const router = async({ route, redirect, req, store }) => {
    const fullPath = route.fullPath;
    // 路由地址在白名单内
    const path = fullPath.split("?")[0];
    if (path && whiteList.includes(path)) return;
    const app = App.getAppContext();
    /** 登录页地址，前台为'/login',后台为'/admin/login_for_sys' */
    const login_url =
        path.indexOf("/admin") !== 0 ? "/login" : "/admin/login_for_sys";
    
    if (process.server) { // 服务端不请求登录状态，避免session冲突！！！
        redirect(login_url, { fromPath: fullPath });
        return;
    } else {
        // client
        // 和sotore.state.user一样，这两处都存了user，任选一个判断即可
        if (app.getDB().get("user")) return;
    }
    let config = { headers: {} };
    // 路由地址不在白名单内，需要判断是否登录
    // 查询是否已登录或记住我，返回成功则协商密钥
    await app
        .getHttp()
        .get("/user/isrecord", config)
        .then(data => {
            if (data.status !== 200) { // 失败去登录页
                redirect(login_url, { fromPath: fullPath });
                return;
            }
            const user = data.data.user;
            app.getDB().set('user', user);
            app.getSecure().secureInit();
        });
};
// 看来这个是可以用异步函数的，
export default router;