/*
 * @Author: your name
 * @Date: 2020-02-17 17:44:08
 * @LastEditTime: 2020-02-23 19:19:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\admin\user\components\insert-or-update\insert-updaate-role.ts
 */
import Vue from "vue";
import Component from "vue-class-component";
import TreeComponent from "@/core/modules/components/commons/tree/tree.vue";
import SelectComponent from "@/core/modules/components/commons/form/select/select.vue";
import ButtonComponent from "@/core/modules/components/commons/form/button/button";
import { Prop, Emit } from "vue-property-decorator";
@Component({
  components: { SelectComponent, TreeComponent, ButtonComponent }
})
export default class InsertOrUpdateRoleComponent extends Vue {
  @Prop({ type: Array, default: () => [] })
  roles!: [];
  @Prop({ type: Array, default: () => [] })
  powers!: [];
  @Prop({
    default: () => {
      return { pid: -1, powers: null };
    }
  })
  role!: any;
  @Prop({type: String,default:'' })
  operate!: string;
  get powerIDs() {
    if (!this.role.powers) return [];
    return this.role.powers.map((e: any) => {
      return e.id;
    });
  }

  set powerIDs(v: any) {
    this.role.powers = v.map((id: number) => {
      return { id };
    });
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
    return this.role;
  }
}
