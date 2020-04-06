/*
 * Filename: d:\frontend\vue\nuxt-ssr\components\commons\side-menu\side-menu.ts
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Saturday, December 28th 2019, 6:12:50 pm
 * Author: zzp-dog
 * 侧边菜单 - 递归组件
 * Copyright (c) 2019 Your Company
 */
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class SideMenuComponent extends Vue {
    /** 传入的菜单树 */
    @Prop({
        type: Object,
        default: function() {
            return {}
        } 
    })
    tree!: Tree;
    constructor() {
        super();
    }

    beforeMount() {
        // 有level
        if (this.tree.level !== undefined) return;
        // 如果没有level则初始化level
        this.tree.level = 0;
        this.init(this.tree);
        // 输入属性改变了，强制更新
        this.$forceUpdate();
    }

    /**
     * 
     * @param node 节点
     * @param level 节点层级
     */
    init(node: Tree) {
        if (!node.child || !node.child.length) { // 没有子节点
            return;
        }
        // 子节点的父层级 = 父节点的层级
        (<any>node.child).plv = node.level;

        node.child.forEach((c, i , child: any) => {
            // 子节点的层级 = 父节点的层级 + 1
            c.level = child.plv + 1;
            // 递归子节点
            this.init(c);
        });
        
    }

    /**
     * 点击链接
     * @param tree 树
     * @param e 事件
     */
    itemClick(tree: any, e: Event) {
        if (tree.level !== 0 && tree.child && tree.child.length ) {
            if (typeof tree.spread === 'undefined')
            this.$set(tree, 'spread', false);
            tree.spread = !this.tree.spread;
        }
    }

    /**
     * 计算展开项高度
     */
    get computedHeight() {
        // 顶级菜单高度自适应！！！
        if (this.tree.level === 0) {
            return 'auto';
        }
        // 每个链接的高度
        const h = 2.5;
        // 计算所有展开子节点的个数
        const c = this.getChildCount(this.tree, 0);
        return c * h + 'rem';
    }

    /**
     * 
     * @param node 节点
     * @param count 节点总计
     */
    getChildCount(node: Tree, count: number) {
        let c = count;
        if (!node.child) return c;
        if (!node.child.length) return c;
        if (!node.spread) return c;
        c += node.child.length;
        node.child.forEach((n, i) => {
            this.getChildCount(n, c);
        });
        return c;
    }
}

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
}