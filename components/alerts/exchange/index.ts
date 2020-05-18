/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\components\exchange\index.ts
 * Created Date: Thursday, May 7th 2020, 10:02:13 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 兑换云币公用弹窗
 * Last Modified: Thursday May 7th 2020 10:31:03 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

import Component from 'vue-class-component';
import PopComponent from '../../../core/modules/components/commons/biz-alert/_pop/pop';
import { Prop, Ref, Emit } from 'vue-property-decorator';
import BaseComponent from '../../../core/base-component';
import { Throttle } from '~/core/modules/annotations';
@Component({
    components: {
        PopComponent
    }
})
export default class ExchangeComponent extends BaseComponent {

    /** pop弹出-兑换云币 */
    @Ref('pop_for_exchange')popExchangeArg!: PopComponent;
    /** 兑换云币参数配置列表 */
    exchangeArgs: any[] = [];
    /** 选中的兑换云币参数配置 */
    exchangeArg: any = {};
    /** 兑换云币的支付类型,默认0-使用支付宝支付兑换 */
    exchangePayType: number = 0;

    constructor() {
        super();
    }

    @Throttle(1000)
    open() {
        this.getExchangeArgs().then((exchangeArgs: any) => this.exchangeArgs = exchangeArgs).then(() => {
            this.exchangeArg = this.exchangeArgs[0];
            this.popExchangeArg.open();
        });
    }

    close() {
        this.popExchangeArg.close();
    }

    @Emit('exchangeYB')
    exchangeYB(e: any) {
        return {
            e,
            exchangeArg: this.exchangeArg,
            exchangePayType: this.exchangePayType
        }
    }

}