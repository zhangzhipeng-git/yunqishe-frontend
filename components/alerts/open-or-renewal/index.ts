
import Component from 'vue-class-component';
import BaseComponent from '~/core/base-component';
import PopComponent from '../../../core/modules/components/commons/biz-alert/_pop/pop';
import { Ref, Emit } from 'vue-property-decorator';
import { Throttle } from '../../../core/modules/annotations/index';
@Component({
    components: {
        PopComponent
    }
})
export default class OpenRenewalComponent extends BaseComponent {
    /** pop弹出-开通/续费会员 */
    @Ref('pop_for_vip') popVipArg!: PopComponent;
    /** vip时长参数配置列表 */
    vipArgs: any[] = [];
    /** 开通vip的支付类型,默认0-使用云币支付 */
    vipPayType: number = 0;
    /** 开通vip及时长参数配置 */
    vipArg: any = {};

    constructor() {
        super();
    }


    @Throttle(1000)
    open() {
        this.getVipArgs().then((vipArgs: any) => this.vipArgs = vipArgs).then(() => {
            this.vipArg = this.vipArgs[0];
            this.popVipArg.open();
        });
    }

    close() {
        this.popVipArg.close();
    }

    @Emit('openOrRenewalVIP')
    openOrRenewalVIP(e: any) {
        return {
            e,
            vipArg: this.vipArg,
            vipPayType: this.vipPayType
        }
    }

}