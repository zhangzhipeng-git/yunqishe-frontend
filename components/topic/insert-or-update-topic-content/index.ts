/*
* @Author: your name
* @Date: 2020-02-17 17:44:08
 * @LastEditTime: 2020-03-15 11:25:23
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
import EditorComponent from '@/core/modules/components/commons/editor/editor.vue';
import { Prop, Emit } from "vue-property-decorator";
@Component({
  components: { 
    SelectComponent,
    RadioGroupComponent, 
    TreeComponent,
    ButtonComponent,
    EditorComponent 
  }
})
export default class InsertOrUpdateTopicContentComponent extends Vue {
  /** 话题内容 */
  @Prop({type: Object, default: () => {}})
  topicContent!: any;
  /** 话题分类 */
  @Prop({type: Array, default: () => []})
  categories!: any[];
  /** 操作类型 */
  @Prop({type: String, default: 'update'})
  operate!: string;
  /** 所属模块 */
  @Prop({type: Number, default: () => 0})
  module!: number;
  /** 正反面条件列表 */
  list: any[] = [
    {id: 0, description: '否'},
    {id: 1, description: '是'}
  ];
  
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
    this.topicContent.wt = this.module;
    return this.topicContent;
  }

}
