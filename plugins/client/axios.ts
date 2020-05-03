/**
 * 解决刷新界面密钥丢失问题。。。
 */
import App from "~/core/context/app-context";
import { AxiosRequestConfig } from "axios";
// 不需要加密的接口
const PUBLIC_API = [
  // 用户
  "/user/logout",
  "/user/isrecord",
  "/user/setup",
  "/user/f/select/active/list",
  // 用户动态
  "/user/f/select/dynamic/list",
  // 获取公钥，上送密钥
  "/security/getpk", 
  "/security/sendsk",
  // 话题
  "/topicClass/f/select/one",
  "/topicClass/f/select/list",
  // 用户等级
  "/level/f/select/list",
  // 话题内容
  "/topicContent/f/select/one",
  "/topicContent/f/select/list",
  "/topicContent/f/select/recommend/list",
  // 话题回复
  "/topicComment/f/select/one",
  "/topicComment/f/select/list"
  // 文档分类
  ,"/docClass/f/select/top2lv/list"
  ,"/docClass/f/select/end2lv/list"
  // 节
  ,"/docContent/f/select/one"
  // 本项目的媒体只有视频！！！
  // 媒体分类
  ,"/mediaClass/f/select/top2lv/list"
  ,"/mediaClass/f/select/end2lv/list"
  ,"/mediaClass/f/select/oneWithChildren"
  // 媒体内容
  ,"/mediaContent/f/select/one",
  // vip时长配置参数列表
  "/vipArg/u/select/list"
];
export default function({ $axios}: any) {
  if (process && process.server) return;
  // 只在请求要加密接口时才添加拦截进行安全服务初始化，并且在secure初始化后取消拦截
  const req_ic = $axios.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
      const url = (config.url||'').split('?')[0];
      // 放行不需要加密的接口，否则会造成死循环
      if (PUBLIC_API.includes(url)) return config;
      // 等待上送密钥后取消拦截，放行之前涉及加解密的请求api
      await App.getAppContext()
        .getSecure()
        .secureInit();
      $axios.interceptors.request.eject(req_ic);
      return config;
    }
  );
}
