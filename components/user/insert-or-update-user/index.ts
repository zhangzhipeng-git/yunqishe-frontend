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
import TreeComponent from "@/core/modules/components/commons/tree/tree.vue";
import SelectComponent from "@/core/modules/components/commons/form/select/select.vue";
import ButtonComponent from "@/core/modules/components/commons/form/button/button.vue";
import RadioGroupComponent, {Radio} from "@/core/modules/components/commons/form/radio-group/radio-group";
import { Prop, Emit } from "vue-property-decorator";
@Component({
  components: { SelectComponent,RadioGroupComponent, TreeComponent, ButtonComponent }
})
export default class InsertOrUpdateUserComponent extends Vue {
  /** 用户实体 */
  @Prop({ type: Object, default: () => {} })
  user!: any;
  /** 'update'-更新，'insert'-添加 */
  @Prop({type: String, default: ''})
  operate!: string;
  /** 角色列表 */
  @Prop({type: Array, default: () => []})
  roles!: any[];
  statusList: any[] = [
    {id:0,description: '未激活'},
    {id:1,description: '正常'},
    {id:2,description: '禁封'},
    {id:3,description: '风险'},
    {id:4,description: '内置'},
  ];
  radioGroup: Radio[] = [
    {id:-1,description:'保密'},
    {id:0,description:'男'},
    {id:1,description:'女'},
  ]
  get roleIDs(): number[] {
    if (!this.user.roles){
      return [];
    }
    return this.user.roles.map((r: any) => {
      return r.id;
    });
  }
  /**
   * 非内置用户（status!==4），只能更新时只更新角色和状态
   */
  get disabled() {
    return this.operate === 'update' && this.user.status !== 4;
  }

  set roleIDs(v: number[]) {
    this.user.roles = v.map((id: any) => {
      return {id};
    })
  }
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
    console.log(this.user);
    return this.user;
  }
}
