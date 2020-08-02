/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\core\modules\components\commons\editor\util.ts
 * Created Date: Sunday, August 2nd 2020, 6:40:26 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 工具类
 * Last Modified: Sunday August 2nd 2020 6:44:37 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

export default class Util {
    /** 
     * 获取n的父节点
     * @param  {any} n 节点
     */
    static getPreNode(n: any) {
        let pre = n.previousSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    }

    /**
     * 找元素的所有子节点
     * @param p 父元素
     */
    static getAllChilds(p: any): any {
        const childs: any = [p];
        const recursion = (e: any) => {
            const ec = e.children;
            if (!ec) return;
            const len = ec.length;
            if (!len) return;
            for (let i = 0; i < len; i++) {
                const _e = ec[i];
                childs.push(_e);
                recursion(_e);
            }
        };
        recursion(p);
        return childs;
    }

    /**
     * 判断p是否包含c
     * @param p 元素
     * @param c 元素
     */
    static contains(p: any, c: any): boolean {
        if (p.contains) { // firefox不支持
            return p.contains(c);
        }
        // 找p的所有子节点
        const childs = this.getAllChilds(p);
        for (let i = 0, len = childs.length; i < len; i++) {
            if (childs[i] === c) return true;
        }
        if (p === c) return true;
        return false;
    }
}