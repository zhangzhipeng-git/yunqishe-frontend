/*
 * Project: nuxt-ssr
 * FileName: annotation.ts
 * Author: zzp-dog
 * File Created: Friday, 1st May 2020 11:34:52 pm
 * description: 注解
 * Last Modified: Friday, 1st May 2020 11:35:56 pm
 * Modified By: zzp-dog
 * Copyright © zzp-dog, All rights reserved.
 */

// 作用在函数上，函数节流
export function Throttle(n: number) {
    return (target: any, name: any, descriptor: PropertyDescriptor) => {
        let isOver = true;
        const pre = target[name];
        target[name] = function() {
            const args = arguments;
            if (!isOver) return;
            isOver = false;
            setTimeout(() => {
                pre.apply(target, args);
                isOver = true;
            }, n);
        }
    }
}