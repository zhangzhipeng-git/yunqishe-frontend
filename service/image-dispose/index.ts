import { http } from "~/core/context/app-context";
/**
 * 图片配置服务
 */
export default class ImageDisposeService {
    /**
     * 获取轮播图片
     * @param type - 1-首页轮播,2-圈子,3-知行，4-微媒体
     */
    static selectList(params: {type: number}, channel: string = '') {
        return http.get<[]>('/imageDispose'+channel+'/select/list', {params});
    }

}