import { http } from "~/core/context/app-context";
/**
 * 话题内容服务
 */
export default class TopicContentService {
    /**
     * 首页接口合并请求
     */
    static selectProtalAllList() {
        // to-do
    }

    /**
     * 前台获取话题内容简易信息列表(置顶靠前)
     * @param pid? - 所属话题，可选
     * @param type1? 0-非问题（圈子）1-问题（问云）,不传时表示所有
     * @param type2? 1-置顶，2-最新，3-精华，4-人气，5随机 ，不传时表示所有
     * @param isFree? true-查询免费内容，false-查询所有
     * @param pageNum 哪一页
     * @param pageSize 每页大小
     * @return
     */
    static selectList(params: {
        pid?: number,
        type1?: number,
        type2?: number,
        isFree?: boolean,
        pageNum: number,
        pageSize: number
    }, channel: string = '') {
        return http.get('/topicContent' + channel + '/select/list', {params});
    }

    /**
     * 查询推荐列表，可分页
     * @param params 
     * @param channel 
     */
    static selectRecommendList(params: {
        /** 0-圈子，1-问云 */
        type: number;
        pageNum: number;
        pageSize: number;
    }, channel: string = '') {
        return http.get('/topicContent' + channel + '/select/recommend/list', {params});
    }

    /**
     * 根据id查单个话题内容详情
     * @param params 
     * @param channel 
     */
    static selectOne(params: {
        id: number
    }, channel: string = '') {
        return http.get('/topicContent' + channel + '/select/one', {params});
    }
}