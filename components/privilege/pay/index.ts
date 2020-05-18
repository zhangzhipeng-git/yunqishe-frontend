/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\components\pay\vue.ts
 * Created Date: Monday, May 4th 2020, 3:57:16 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 内容查看支付云币或开通会员公用弹窗组件
 * Last Modified: Monday May 4th 2020 3:57:44 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

import Component from 'vue-class-component';
import BaseComponent from '~/core/base-component';
import PopComponent from '~/core/modules/components/commons/biz-alert/_pop/pop';
import DateUtil from '../../../core/modules/util/date-util';
import OpenRenewalComponent from '../../alerts/open-or-renewal/index';
import ExchangeComponent from '../../alerts/exchange/index';
import { Ref } from 'vue-property-decorator';

@Component({
    components: {
        PopComponent,
        OpenRenewalComponent,
        ExchangeComponent
    }
})
export default class PayComponent extends BaseComponent {
    /** pop弹出-支付云币 */
    @Ref('pop_for_charge') popCharge!: PopComponent;
    /** pop弹出-开通会员 */
    @Ref('pop_for_vip') popVipArg!: OpenRenewalComponent;
    /** pop弹出-兑换云币 */
    @Ref('pop_for_exchange') popExchangeArg!: ExchangeComponent;
    /** 要查看的内容 */
    content: any = {};

    /** 2 - 需全价支付云币，3-用户需要开通会员，4-需要开通会员后优惠，5-优惠支付云币（会员特权） */
    get privilegeType() {
        return this.content.privilegeType || -1;
    }

    constructor() {
        super();
    }

    /**
     * 支付云币或开通会员
     * @param c 要查看的内容
     */
    doAction(c: any) {
        this.content = c;
        // 等待dom变化后执行
        this.$nextTick(() => {
            const t = this.privilegeType;
            if (1 === t) { // 去登录
                this.toLogin();
                return;
            } else if (2 === t || 5 === t) { // 全价支付云币||半价支付云币
                this.popCharge.open();
                return;
            } else if (3 === t || 4 === t) { // 开通会员
                this.popVipArg.open();
            }
        });
    }

    /**
     * 去开通vip
     */
    openVIP({ vipArg, vipPayType }: any) {
        this.popVipArg.close();
        if (vipPayType === 0) { // 使用云币支付
            if (this.curUser.coin < vipArg.coin) { // 云币不足
                this.handler.alert({
                    content: '您的云币余额不足~',
                    buttons: ['取消', '兑换云币']
                }).then(ret => {
                    if (2 === ret) { // 兑换云币
                        this.popExchangeArg.open();
                    }
                });
                return;
            }
            // 有足够的云币
            this.handler.alert({
                content: '是否确认支付云币?',
                buttons: ['取消', '确认']
            }).then(ret => { // 确认用云币兑换会员时长
                if (ret === 2) {
                    const pay = {
                        payTime: DateUtil.now(), // 支付时间
                        aid: vipArg.id,     // 会员时长列表id
                        payType: 1,              // 支付方式：1-云币，2-支付宝，3-微信
                        forType: 2,              // 目的类型：1-兑换云币，2-开通vip，3-开通svip（备用）
                    };
                    this.handler.load();
                    this.httpRequest(this.http.post('/pay/f/insert/one', pay, { throttle: 1000 }), {
                        success: (data: any) => {
                            this.handler.unload();
                            const text = '您已成功开通VIP';
                            this.handler.toast({ text, duration: 2000 });
                            this.curUser.roleNames.push('vip'); // 客户端用户添加会员标识
                            this.curUser.coin -= vipArg.coin; // 客户端用户云币更新
                            if (this.privilegeType === 3 || this.privilegeType === 4) { // 需要开通会员时，为3时开通会员后，权限变为有权限，为4时，后续步骤需要支付优惠后的云币
                                this.$emit('complete', this.content.privilegeType = this.privilegeType === 3 ? 0 : 5);
                            }
                        }
                    });
                }
            });
            return;
        }
    }

    /**
     * 支付云币
     */
    payYB() {

    }

    /**
     * 兑换云币
     */
    exchangeYB() {

    }
}