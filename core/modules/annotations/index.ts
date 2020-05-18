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
/**
 * 节流装饰器
 * @param n 节流时间 ms
 * @param callback  节流提前返回的回调
 */
export function Throttle(n: number, callback?: Function) {
    /**
     * target 类的原型，name 类的属性，descriptor 类的属性的描述器
     */
    return (target: any, name: any, descriptor: PropertyDescriptor) => {
        let isOver = true;
        const pre = target[name];
        descriptor.value = function() { // 因为name编译后可能变化，这里用descriptor进行value重写
            const args = arguments;
            if (!isOver) {
                return callback&&callback(this);
            };
            isOver = false;
            pre.apply(this, args); // 第一次不节流，及时执行
            setTimeout(() => {
                isOver = true;
            }, n);
        }
    }
}