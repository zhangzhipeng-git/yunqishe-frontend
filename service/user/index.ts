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
}