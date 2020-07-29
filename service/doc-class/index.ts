import { http } from "~/core/context/app-context";
/**
 * 文档分类服务
 */
export default class DocClass {

    /**
     * 查询文档前两级分类
     * @param channel 
     */
    static selectTop2LvList(channel: string = '') {
        return http.get('/docClass' + channel + '/select/top2lv/list');
    }

    /**
     * 查询文档后两级分类
     * @param pid 父id （这里是2级分类id）
     * @param channel 
     */
    static selectEnd2LvList(params: {
        pid: number;
    }, channel: string = '') {
        return http.get('/docClass' + channel + '/select/end2lv/list', {params});;
    }
}