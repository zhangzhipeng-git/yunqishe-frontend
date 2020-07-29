import { http } from "~/core/context/app-context";
/**
 * 文档内容服务
 */
export default class DocContentService {
   
    /**
     * 根据文档内容id找文档内容
     * @param id 文档内容id
     * @param channel 
     */
    static selectOne(params: {id: number}, channel: string = '') {
        return http.get('/docContent'+channel+'/select/one', {params});
    }
}