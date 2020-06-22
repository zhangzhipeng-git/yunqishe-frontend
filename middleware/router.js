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
// 限制频繁请求
if (process&&process.server) {
    global.reqLimit = (req, error) => {
        let hostMap = global.hostMap;
        const host = req.headers['host'];
        if (!hostMap) {
            hostMap = global.hostMap = {};
        }
        if (!hostMap[host]){
            hostMap[host] = {
                lastTime: Date.now(),
                count: 1
            }
        }
        const hostInfo = hostMap[host];
        if (hostInfo.count > 25) { // 请求超过最大次数，暂且设为后端的1/2
            if (hostInfo.count === 26) {
                setTimeout(() => { // 1小时候解除请求限制
                    delete hostMap[host];
                }, 1000 * 60 * 60);
            }
            hostInfo.count++;
            error({ statusCode: 500, message: '已达到最大请求次数，请1小时后再访问。' });
            return;
        }
        const now = Date.now();
        if (now - hostInfo.lastTime < 5 * 1000) { // 在指定间隔时间内才累计请求数
            hostInfo.count++;
        } else { // 重置请求数为1
            hostInfo.count = 1;
        }
        hostInfo.lastTime = now;
    }
}

const router = async({route, redirect, req, error, store }) => {
    if (process && process.server) global.reqLimit(req, error);
    const fullPath = route.fullPath;
    // 路由地址在白名单内
    const path = fullPath.split("?")[0];
    if (path && whiteList.includes(path)) return;
    const app = App.getAppContext();
    // 登录url
    const login_url = path.indexOf("/admin") !== 0 ?
     "/login" : "/admin/login_for_sys";
    if (store.state.user) { // 用户已登录，放行
        return;
    }
    // 服务端在nuxtServerInit中已判断过用户是否登录，
    // 未登录直接重定向到登录页
    if (process && process.server) {
        redirect(login_url, { fromPath: fullPath });
        return;
    }
    // 用户是否已登录
    await app.getHttp().get("/user/isrecord").then(data => {
        if (data.status !== 200) { // 失败去登录页
            redirect(login_url, { fromPath: fullPath });
            return;
        }
        const user = data.data.user;
        store.commit('setUser', user);
    });
};
export default router;