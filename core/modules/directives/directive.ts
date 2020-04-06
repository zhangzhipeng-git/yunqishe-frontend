import { VNode } from 'vue';

/**
 * 自定义Vue指令接口
 */
export default interface VueDirective {
    bind(
        el: HTMLElement | Element | Node,
        binding?: {
            name: string,
            value: {[key: string]: any},
            oldValue: {[key: string]: any},
            expression: string,
            arg: string,
            modifires: {[key: string]: any},
        },
        vnode?: VNode,
        oldVnode?: VNode
    ): void;
    inserted?(
        el: HTMLElement | Element | Node,
        binding?: {
            name: string,
            value: {[key: string]: any},
            oldValue: {[key: string]: any},
            expression: string,
            arg: string,
            modifires: {[key: string]: any},
        },
        vnode?: VNode,
        oldVnode?: VNode
    ): void;

    update?(
        el: HTMLElement | Element | Node,
        binding?: {
            name: string,
            value: {[key: string]: any},
            oldValue: {[key: string]: any},
            expression: string,
            arg: string,
            modifires: {[key: string]: any},
        },
        vnode?: VNode,
        oldVnode?: VNode
    ): void;

    componentUpdated?(
        el: HTMLElement | Element | Node,
        binding?: {
            name: string,
            value: {[key: string]: any},
            oldValue: {[key: string]: any},
            expression: string,
            arg: string,
            modifires: {[key: string]: any},
        },
        vnode?: VNode,
        oldVnode?: VNode
    ): void;

    unbind(
        el: HTMLElement | Element | Node,
        binding?: {
            name: string,
            value: {[key: string]: any},
            oldValue: {[key: string]: any},
            expression: string,
            arg: string,
            modifires: {[key: string]: any},
        },
        vnode?: VNode,
        oldVnode?: VNode
    ): void;

}
