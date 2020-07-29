import { http } from "~/core/context/app-context";
/**
 * 用户服务
 */
export default class UserService {
    /**
     * 首页查询用户列表 - 只包含id，性别，头像，昵称，经验
     * @param sex? - -1-全部，1-男，2-女，3-未知
     * @param type? - -1-全部，1- 活跃，2-新人，3-随机
     * @param pageNum 哪一页
     * @param pageSize 页大小
     * @return
     */
    static selectList(params: {
        sex?: number,
        type?: number,
        pageNum: number,
        pageSize: number
    }, channel: string = '') {
        return http.get('/user' + channel + '/select/list', {params});
    }

    /**
     * 根据用户id查用户详情
     * @param id 用户id
     * @param channel
     * @returns
     */
    static selectDetailOne(params: {
        id: number;
    }, channel: string = '') {
        return http.get('/user' + channel + '/select/detail/one', {params})
    }


    /**
     * 查询用户动态列表
     * @param id 用户id
     * @param type 动态类型 1-全部，2-圈子，3-问答，4-相册，5-音乐，6-视频
     * @param pageNum 哪一页
     * @param pageSize 分页大小
     * @returns
     */
    static selectDynamicList(params: {
        type: number;
        id: number;
        pageNum: number;
        pageSize: number;
    }, channel: string = '') {
        return http.get('/user'+channel+'/select/dynamic/list', {params});
    }

    /**
     * 更新个人资料
     * @param data 用户model(后台限定可修改字段)
     * @param channel 
     * @returns
     */
    static updateOne(data: any, channel: string = '') {
        return http.post('/user' + channel + '/update/one', data);
    }

    /**
     * 个性化
     * @param  {any} data 用户model(后台限定可修改字段)
     * @param  {string=''} channel
     * @returns
     */
    static updatePersonalizeInfo(data: any, channel: string = '') {
        return http.post('/user' + channel + '/update/personalizeInfo', data);
    }
}