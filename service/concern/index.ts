import { http } from "~/core/context/app-context";
/**
 * 关注或收藏服务
 */
export default class ConcernService {
   
    /**
     * 关注/收藏或取消关注/收藏
     * @param data 
     * @param channel 
     */
    static insertOrUpdate(data: {
        /** 关注/收藏的对象的id */
        oid: number;
        /** 1-话题内容，2-圈子话题,3-问云话题，4-媒体，5-媒体内容，6用户 */
        type: number;
        /** 1-关注，0-不关注 */
        concern: number;
        /** 关注/收藏方id */
        uid: number;
    }, channel: string = '') {
        return http.post('/concern' + channel + '/insertOrUpdate/one', data);
    }
}