/*
 * @Author: your name
 * @Date: 2020-02-17 17:44:08
 * @LastEditTime: 2020-02-26 10:23:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\admin\user\components\insert-or-update\insert-updaate-power.ts
 */
import Vue from "vue";
import Component from "vue-class-component";
import TreeComponent from "@/core/modules/components/commons/tree/tree.vue";
import SelectComponent from "@/core/modules/components/commons/form/select/select.vue";
import ButtonComponent from "@/core/modules/components/commons/form/button/button.vue";
import { Prop, Emit } from "vue-property-decorator";
@Component({
  components: { SelectComponent, TreeComponent, ButtonComponent }
})
export default class InsertOrUpdatePowerComponent extends Vue {
  /** 权限实体 */
  @Prop({ type: Object, default: () => {} })
  power!: any;
  /** 'updatechild'- 添加子节点时不显示下拉框 */
  @Prop({type: String, default: ''})
  operate!: string;
  /** 权限列表 */
  @Prop({type: Array, default: () => []})
  powers!: any[];
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
    console.log(this.power);
    return this.power;
  }
}
