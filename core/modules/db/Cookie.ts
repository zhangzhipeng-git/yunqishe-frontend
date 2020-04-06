/*
 * @Author: your name
 * @Date: 2020-01-15 20:45:49
 * @LastEditTime: 2020-02-18 23:43:27
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\core\db\Cookie.ts
 */

/**
 * cookie存储 4K
 * httpOnly为true时不可用！！！
 */
export default class Cookie {
    constructor() {
     }
    /**
     * 设置cookie
     * @param key 键名
     * @param value 键值
     * @param days 天数
     */
    public set(key: string, value: string, days: number) {
        const exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        window.document.cookie = key + '=' + escape(value) + ';expires=' + exp.toUTCString();
    }

    /**
     * 根据键名获取值
     * @param key 键名
     */
    public get(key: string) {
        let arr;
        const reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
        // tslint:disable-next-line: no-conditional-assignment
        if (arr = document.cookie.match(reg)) {
            const valuestr = unescape(arr[2]);
            try {
                return JSON.parse(valuestr);
            } catch {
                return valuestr;
            }
        }
        return null;
    }

    /**
     * 根据键名删除键值
     * @param key 键名
     */
    public remove(key: string) {
        const value = this.get(key);
        if (value !== null) {
            const exp = new Date();
            exp.setTime(exp.getTime() - 1000);
            window.document.cookie = key + '=' + escape(value) + ';expires=' + exp.toUTCString();
        }
    }
}
