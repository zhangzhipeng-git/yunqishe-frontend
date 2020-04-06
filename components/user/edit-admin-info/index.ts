/*
* @Author: your name
* @Date: 2020-02-17 17:44:08
* @LastEditTime: 2020-02-23 20:24:32
* @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: \nuxt-ssr\pages\admin\user\components\insert-or-update\insert-updaate-user.ts
*/
import Vue from "vue";
import Component from "vue-class-component";
import SMSComponent from '@/core/modules/components/commons/form/sms/sms';
import TreeComponent from "@/core/modules/components/commons/tree/tree.vue";
import SelectComponent from "@/core/modules/components/commons/form/select/select.vue";
import ButtonComponent from "@/core/modules/components/commons/form/button/button.vue";
import { Prop, Emit } from "vue-property-decorator";
@Component({
  components: { 
    SelectComponent,
    TreeComponent, 
    ButtonComponent ,
    SMSComponent
  }
})
export default class EditAdminInfoComponent extends Vue {
  /** 验证类型，邮箱和手机号 */
  @Prop({type: String, default: () => 'email'})
  vtype!: string;
  /** 用户实体 */
  @Prop({ type: Object, default: () => {} })
  user!: any;
  /** 'update'-更新，'insert'-添加 */
  @Prop({type: String, default: ''})
  operate!: string;
  /** 发送验证码的函数 */
  @Prop({type: Function, default: () => () => void 0})
  sendSMS!: Function;
  /** 验证码组件的验证状态 */
  @Prop({type: Number, default: () => 0})
  SMSStatus!: number;
  /** 性别 */
  sexList: any[] = [
    {id:-1,description:'保密'},
    {id:0,description:'男'},
    {id:1,description:'女'},
  ];
  /** 重复密码 */
  repassword: string = '';
  constructor() {
    super();
  }
  /** 关闭弹窗 */
  close() {
    (<any>this.$parent).close();
  }
  /** 确认并关闭弹窗 */
  @Emit("confirm")
  confirm() {
    return this.user;
  }
}
