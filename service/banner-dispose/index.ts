import { http } from "~/core/context/app-context";
/**
 * banner配置服务
 */
export default class BannerDisposeService {
    /**
     * 获取轮播图片
     * @param type - 1-首页轮播,2-圈子,3-知行，4-微媒体
     */
    static selectList(params: {type: number}, channel: string = '') {
        return http.get<[]>('/bannerDispose'+channel+'/select/list', {params});
    }

}