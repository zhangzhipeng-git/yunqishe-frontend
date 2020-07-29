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
    /**
     * 批量关注话题
     * @param  {number} type 0-圈子，1-问云
     * @param  {number[]} data 话题id集合
     * @param  {string=''} channel
     */
    static batchInsert(type: number, data: number[], channel: string = '') {
        return http.post('/concern' + channel + '/batch/insert?type='+ type, data);
    }
}