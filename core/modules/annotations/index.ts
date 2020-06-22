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
 * 节流装饰器，作用在类的方法上
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
        descriptor.value = function() { // 这里用descriptor进行value重写
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

/**
 * 添加响应式表单，需放在@Component装饰器的后面，作用在类上
 * @param target 需要添加响应式表单的组件类
 */
export const ReactiveForm: Function = (target: any) => {
    const proto: any = target.prototype;
    proto.refs = {}; // 响应式表单集合
    const mounted = proto.mounted || function(){};
    proto.mounted = function() { // 生成新的mounted
        mounted.apply(this, arguments);
        this.$nextTick(() => { // 等input挂载并校验完毕后设置响应式校验结果
            const refs = this.$refs;
            const keys = Object.keys(refs);
            for (let i = 0, len = keys.length; i < len; i++) {
                const k = keys[i];
                const elem = this.$refs[k];
                const flag = elem.getAttribute&&elem.getAttribute('formgroup');
                if (flag == null && elem.tagName !== 'FORM') {
                    continue; 
                }
                const checkForm = this.$refs[k].checkForm;
                this.$set(this.refs, k, checkForm);
            }
        });
    };
}