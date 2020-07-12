/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\core\modules\util\cal-util.ts
 * Created Date: Thursday, May 7th 2020, 11:38:07 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 精确加减乘除计算器
 * Last Modified: Thursday May 7th 2020 11:39:03 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

export default class Calculator {

    /** 取最大数函数 */
    static max: Function = Math.max;
    /** 取最小数函数 */
    static min: Function = Math.min;
    /** 求某数的次幂函数 */
    static pow: Function = Math.pow;
    /** 求某数的绝对值函数 */
    static abs: Function = Math.abs;

    /**
     * 精确加法
     * @param num1 数1
     * @param num2 数2
     * @param keep 是否控制精度和最长精度一致，如1.1+1.9 = 3.0，默认不保留后面的0
     */
    public static plus(num1: number, num2: number, keep: boolean = false) {
        const d1 = (num1+'').split('.')[1];
        const d2 = (num1+'').split('.')[1];
        const dlen1 = !!d1? d1.length : 0;
        const dlen2 = !!d2? d2.length : 0;
        const x = this.max(dlen1, dlen2);
        const m = this.pow(10, x);
        const r = (num1 * m + num2 * m) / m;
        return keep ? r.toFixed(x) : r;
    }

    /**
     * 精确减法
     * @param num1 数1
     * @param num2 数2
     * @param keep 是否控制精度和最长精度一致，如1.1-.1 = 1.0，默认不保留后面的0
     */
    public static minus(num1: number, num2: number, keep = false) {
        return this.plus(num1, -num2, keep);
    }

    /**
     * 两数相乘
     * @param num1 数1
     * @param num2 数2
     */
    public static times(num1: number, num2: number, divide = false) {
        const numstr1 = num1 + '';
        const numstr2 = num2 + '';
        const d1 = numstr1.split('.')[1];
        const d2 = numstr2.split('.')[1];
        const dlen1 = !!d1? d1.length : 0;
        const dlen2 = !!d2? d2.length : 0;
        return ((num1 * (dlen1 === 0 ? 1 : dlen1)) * (num2 * (dlen2 === 0 ? 1 : dlen2))) * this.pow(10, divide? -dlen1 - dlen2 : dlen1 - dlen2);
    }

    /**
     * 两数相除
     * @param num1 数1
     * @param num2 数2
     */
    public static divide(num1: number, num2: number) {
       return this.times(num1, num2, true);
    }

}


export function calculator() {
    // @ts-ignore
    Number.prototype.plus = function(num2) {
        // @ts-ignore
        return Calculator.plus(this, num2);
    }
    // @ts-ignore
    Number.prototype.minus = function(num2) {
        // @ts-ignore
        return Calculator.plus(this, -num2);
    }
    // @ts-ignore
    Number.prototype.times = function(num2) {
        // @ts-ignore
        return Calculator.times(this, num2);
    }
    // @ts-ignore
    Number.prototype.divide = function(num2) {
        // @ts-ignore
        return Calculator.times(this, num2, true);
    }
}
