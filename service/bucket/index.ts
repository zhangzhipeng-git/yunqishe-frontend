import { http } from "~/core/context/app-context";
/**
 * 存储桶服务
 */
export default class BucketService {

    /**
     * 单文件上传(覆盖)
     * @param  {FormData} data
     * @param  {string} what 'avator' - 头像， 'bgm' - 背景音乐， 'bgp' - 背景图像
     * @param  {string=''} channel
     * @returns
     */
    static updateOne(data: FormData, what: string, channel: string = '') {
        return http.$post('/bucket' + channel + '/upload/'+ what, data, {
            config: {
                headers: { "Content-Type": "multipart/form-data" },
            }
        });
    }

}