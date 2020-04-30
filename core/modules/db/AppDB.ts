/**
 * app存贮类
 */
export default class AppDB {
    constructor() {
    };
    /** app全局存贮，相当于spa中的sessionStorage */
    static db: {[k: string]: any} = {};
    /**
     * 设置键值
     * @param k 键
     * @param v 值
     */
    public set(k: string, v: any): void {
        AppDB.db[k] = v;
    }

    /**
     * 根据键值获取value
     * @param k 键值
     */
    public get(k: string): any {
        return AppDB.db[k];
    }
}