/*
 * Project: nuxt-ssr
 * FileName: xss.ts
 * Author: zzp-dog
 * File Created: Saturday, 11th April 2020 1:11:41 pm
 * description: 对所有html转义和过滤
 * Last Modified: Saturday, 11th April 2020 3:11:49 pm
 * Modified By: zzp-dog
 * Copyright © zzp-dog, All rights reserved.
 */

/**
 * html转义和过滤
 * @param v html字符串
 */
export default function xss(v: string) {
    if (!v) return '';
    return v.replace(/&/gm, '&amp')
            .replace(/</gm, '&lt;')
            .replace(/>/gm, '&gt;')
            .replace(/\//gm, '&#47;')
            .replace(/\\/gm, '&#92;')
            .replace(/"/gm, '&quot;')
            .replace(/scirpt/gm, '')
            .replace(/eval\((.*)\)/gm, '');
}