/*
 * Project: nuxt-ssr
 * FileName: vip.ts
 * Author: zzp-dog
 * File Created: Sunday, 5th April 2020 7:21:43 pm
 * description: vip过滤器
 * Last Modified: Sunday, 5th April 2020 7:23:25 pm
 * Modified By: zzp-dog
 * Copyright © zzp-dog, All rights reserved.
 */

export default function vip(v: Array<string>|string) {
    if (v.indexOf('svip') > -1) return 'svip';
    if (v.indexOf('vip') > -1) return 'vip';
    return v;
}