import { http } from "~/core/context/app-context";
/**
 * 媒体内容服务
 */
export default class MediaClassService {
   
    /**
     * 查询媒体分类前两级，一级分类的最大子分类个数不超过maxSize个
     * @param maxSize 一级分类的最大子分类个数
     * @param channel 
     */
    static selectTop2LvList(params: {maxSize: number}, channel: string = '') {
        return http.get('/mediaClass'+channel+'/select/top2lv/list', {params});
    }
}