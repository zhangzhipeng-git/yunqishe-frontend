/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\core\modules\components\commons\side-menu\side-menu.ts
 * Created Date: Saturday, February 22nd 2020, 8:16:02 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 菜单树
 * Last Modified: Monday July 27th 2020 10:01:23 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */


import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
@Component({
    name: 'SideMenuComponent',
    components: {
        SideMenuComponent
    }
})
export default class SideMenuComponent extends Vue {
    /** 传入的菜单树 */
    @Prop({type: Array,default: function() {return []} })trees!: Tree[];
    /** child的key，默认'child' */
    @Prop({type: String, default: 'child'})childKey!: string;
    /** 激活的那个节点 */
    @Prop({type: Object, default: () => {}})active!: any;
    /** height, 默认2.5rem */
    @Prop({type: String, default: '2.5rem'})height!: string;

    get heightValue() {
        return parseFloat(this.height);
    }

    get heightUnit() {
        // @ts-ignore
        return this.height.match(/[a-zA-Z]+$/)[0] || 'rem';
    }

    constructor() {
        super();
    }

    @Watch('trees', {immediate: true})
    watchTree(nv: Tree[]) {
        /**
         * 备注：如第一个树列表进入，将父组件状态标记为已初始化
         * 其子树列表发现父组件已进行递归初始化，则不再进行初始化
         * 为什么要设置全局公用的激活节点?
         * 因为这里使用的递归组件，如果不使用公用激活节点，比如只改变其中一个组件的激活节点，其他组件的激活节点不会变，此时就会出现多个激活节点的现象！！！
         */
        (<any>this).HAS_INIT = true;
        if (this.$parent && (<any>this).$parent.HAS_INIT) return;
        if (!nv||!nv.length) return;
        // 所有树公用激活状态，原因见注释！active.node即为全局共享的激活节点
        let active = {node: (<any>nv).active};
        nv.forEach((n: any) => {
            // 如果没有parent则初始化parent
            if (n[this.childKey] && n[this.childKey][0].parent !== n)this.setParent(n);
            // 如果没有level则初始化level
            if (n.level === undefined)this.setLevel(n, 0);
            // 如果没有spread则初始化spread
            if (n.spread === undefined)this.setSpread(n);
            // 如果没有active则初始化active
            if (n.active === undefined)this.setActive(n, active);
        });

        // 设置激活类的所有父节点展开
        if (active.node) {
            this.setParentSpread(active.node);
            this.setParentHeight(active.node);
        }
    }
    

    /**
     * spread初始化
     * @param n 节点
     */
    setSpread(n: any) {
        if (n.spread === undefined) {
            this.$set(n, 'spread', false);
        }
        const childs = n[this.childKey];
        if (childs&&childs.length) {
            childs.forEach((c: any) => {
                this.setSpread(c);
            });
        }
    }

    /**
     * 父节点展开
     * @param node 激活的节点
     */
    setParentSpread(node: any) {
        node.spread = true;
        if (node.parent)
        this.setParentSpread(node.parent);
    }

    /**
     * 初始化激活类，所有节点都会引用的对象 - 被激活的节点
     * @param node 节点
     * @param o 激活对象
     */
    setActive(node: Tree, o: any) {
        this.$set(node, 'active', o);
        const childs = node[this.childKey];
        if (childs&&childs.length) {
            childs.forEach((e: any) => {
                this.setActive(e, o);
            })
        }
    }

    /**
     * 设置子节点的父节点
     * @param tree 树
     */
    setParent(tree: any) {
        if (!tree[this.childKey]) return;
        tree[this.childKey].forEach((e: any) => {
            e.parent = tree;
            this.setParent(e);
        });
    }
    /**
     * 
     * @param node 节点
     * @param level 节点层级
     */
    setLevel(node: Tree, level: number) {
        this.$set(node, 'level', level);
        if (!node[this.childKey] || !node[this.childKey].length) { // 没有子节点
            return;
        }
        ++level;
        // 子节点的父层级 = 父节点的层级
        (<any>node[this.childKey]).plv = node.level;
        node[this.childKey].forEach((c: any) => {
            c.parent = node;
            // 递归子节点
            this.setLevel(c,level);
        });
        --level;
    }

    /**
     * 点击链接
     * @param node 树
     * @param e 事件
     */
    itemClick(node: any, e: Event) {
        if (node[this.childKey] && node[this.childKey].length ) {
            if (typeof node.spread === 'undefined')
            this.$set(node, 'spread', false);
            node.spread = !node.spread;
        } else { // 无子节点的发射点击事件
            this.$emit('navigate', node);
        }
        // 当前点击节点被激活
        node.active.node = node;
        this.setParentHeight(node);
    }

    /**
     * 递归设置当前树的父节点高度
     * @param tree 当前树
     */
    setParentHeight(tree: any) {
        const c = this.getSpreadChildCount(tree, 0);
        const height = (c*this.heightValue)+this.heightUnit;
        if (!tree.height) {
            this.$set(tree, 'height', height);
        } else {
            tree.height = height;
        }
        if (!tree.parent) return;
        this.setParentHeight(tree.parent);
    }

    /**
     * 获取展开节点的总数
     * @param node 节点
     * @param count 节点总计
     */
    getSpreadChildCount(node: Tree, count: number) {
        if (!node.spread || !node[this.childKey]) {
            return count + 0; // +0
        }
        const len = node[this.childKey].length;
        count += len;
        for (let i = 0; i < len; i++) {
            const e = node[this.childKey][i];
            // 值传递，不是引用传递，需要接收返回
            count = this.getSpreadChildCount(e, count);
        }
        return count;
    }
}
Vue.component('SideMenuComponent', SideMenuComponent);

/**
 * 菜单树
 */
export interface Tree {
    /** 节点id */
    id?: number;
    /** 节点名称 */
    name?: string;
    /** 节点rul */
    url?: string;
    /** 左节点图标 */
    leftIcon?: Array<string>;
    /** 右节点图标 */
    rightIcon?: Array<string>;
    /** 是否聚焦，总是只激活一个！！！ */
    active?: boolean;
    /** 是否展开 */
    spread?: boolean;
    /** 节点层级 */
    level?: number;
    /** 子节点 */
    child?: Array<Tree>;
    parent?: Tree;
    [k: string] : any;
}