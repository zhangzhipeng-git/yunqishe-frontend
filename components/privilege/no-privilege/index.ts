/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\components\no-privilege\index.ts
 * Created Date: Monday, May 4th 2020, 6:28:55 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 内容查看权限提示组件，需配合PayComponent使用！！！
 * Last Modified: Tuesday May 5th 2020 10:34:03 am
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import PayComponent from '../pay';

@Component
export default class NoPrivilegeComponent extends Vue {
    /** 需要支付云币或开通会员才能看的的内容 */
    @Prop({type: Object, default: () => {}})content!: any;
    /** PayComponent实例引用 */
    @Prop({type: Object, default: () => {}})pay!: PayComponent;

    /** 查看内容的权限类型 */
    get privilegeType() {
        return this.content.privilegeType || -1;
    }

    /** 权限提示对象*/
    get privilege() {
        const pri: any = {};
        switch(this.privilegeType) {
            case 1:
                pri.tip = '请先登录';
                pri.text = '登录';
                break;
            case 2:
                pri.tip = '需支付云币';
                pri.text = '支付云币';
                break;
            case 3:
                pri.tip = '需开通会员';
                pri.text = '开通会员';
                break;
            case 4:
                pri.tip = '会员半价';
                pri.text = '开通会员';
                break;
            case 5:
                pri.tip = '需半价（会员）支付云币';
                pri.text = '支付云币（半价）';
                break;
        }
        return pri;
    }

    constructor() {
        super();
    }

    doAction() {
        if (!this.pay) return;
        this.pay.doAction(this.content);
    }
}