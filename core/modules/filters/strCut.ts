/*
 * @Author: your name
 * @Date: 2020-03-09 19:52:41
 * @LastEditTime: 2020-03-09 19:52:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\core\filters\strCut.ts
 */
export default function strCut(v: string, mlen: number) {
    if(!v || mlen < 1) return '';
    let count = 0;
    for (let i = 0, len = v.length; i < len; i++) {
        const code = v.charCodeAt(i);
        if (code >=0 && code <= 128) ++count;
        else count += 2;
        if (count > mlen) {
            if (i === 0) return '';
            return v.substr(0, i) + '...';
        }
    }
    return v;
}