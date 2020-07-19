import { http } from "~/core/context/app-context";
/**
 * 点赞或反对服务
 */
export default class ThumbService {
   
    /**
     * 点赞或反对或无状态
     * @param data 
     * @param channel 
     */
    static insertOrUpdate(data: {
        /** 关注/收藏的对象的id */
        oid: number;
        /** 1-话题内容，2-话题内容回复，3-媒体内容，4-媒体内容回复，5-用户 */
        type: number;
        /** 1-关注，0-不关注 */
        thumb: number;
        /** 关注/收藏方id */
        uid: number;
    }, channel: string = '') {
        return http.post('/thumb' + channel + '/insertOrUpdate/one', data);
    }
}