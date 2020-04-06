/*
 * @Author: your name
 * @Date: 2020-03-25 21:19:25
 * @LastEditTime: 2020-03-25 21:47:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\core\filters\async.ts
 */
export default async function async(v: Promise<any>) {
    v = await v;
    return v;
}