/*
 * @Author: your name
 * @Date: 2020-01-15 20:45:49
 * @LastEditTime: 2020-01-22 00:17:21
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\core\db\SessionStorege.ts
 */

/**
 * 会话级别存储 - 单页应用中相当于window的存贮
 *
 * 同源页面级别，a页面通过js或a跳转到b，若a，b同源，则b会拷贝a的session存贮
 */

export default class SessionStorage {
    constructor() {
    }
    /**
     * 设置会话级别持久化数据存储
     * @param key 键名
     * @param value 键值
     */
    public setItem(key: string, value: any) {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    }
    /**
     * 根据键名获取值
     * @param key 键名
     */
    public getItem(key: string): object | number | string {
        const valuestr = window.sessionStorage.getItem(key)!;
        try {
            return JSON.parse(valuestr);
        } catch {
            return valuestr;
        }
    }
    /**
     * 根据键名清除值
     * @param key 键名
     */
    public removeItem(key: string) {
        window.sessionStorage.removeItem(key);
    }
    /**
     * 清空会话存储
     */
    public clear() {
        window.sessionStorage.clear();
    }
}
