import { http } from "~/core/context/app-context";
/**
 * 话题内容评论服务
 */
export default class TopicCommentService {
    
    /**
     * 查询一级评论内容列表（每条一级评论带1页二级评论）或者只查二级评论
     * @param params
     * @param channel 
     */
    static selectList(params: {
        /** 话题内容id */
        tcid?: number;
        /** 父级评论id */
        pid: number;
        /** 一级评论当前页 */
        pageNum1?: number;
        /** 一级评论页大小 */
        pageSize1?: number;
        /** 一级评论的二级评论当前页 */
        pageNum2: number;
        /** 一级评论的二级评论页大小 */
        pageSize2: number;
    }, channel: string = '') {
        return http.get<{}[]>('/topicComment'+channel+'/select/list', {params});
    }

    /**
     * 回复
     * @param data 
     * @param channel 
     */
    static insertOne(data: {
        /** 父级回复id */
        pid: number;
        /** 给谁回复，被回复者id */
        wid: number;
        /** 回复者id */
        uid: number;
        /** 所属话题内容id */
        tcid: number;
        /** 回复内容 */
        text: string;
        /** 设备 */
        device: number;
    }, channel: string = '') {
        return http.post('/topicComment'+channel+'/insert/one', data);
    }
}