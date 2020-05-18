/**
 * app存贮类
 */
import Vue from 'vue';
export default class AppDB {
    constructor() {
    };
    [index: string]: any;
    /**
     * 响应式设置键值
     * @param k 键
     * @param v 值
     */
    public $set(k: string, v: any): void {
        Vue.set(this, k, v);
    }

    /**
     * 根据键值获取响应式value
     * @param k 键值
     */
    public $get(k: string): any {
        return this[k];
    }

    /**
     * 根据key删除value
     * @param k 键值
     */
    public $delete(k: string): any {
        Vue.delete(this, k);
    }

     /**
     * 非响应式设置键值
     * @param k 键
     * @param v 值
     */
    public set(k:string, v: any) {
        (<any>AppDB)[k]=v;
    }

    /**
     * 根据键值获取非响应式value
     * @param k 键值
     */
    public get(k: string): any {
        return (<any>AppDB)[k];
    }

}