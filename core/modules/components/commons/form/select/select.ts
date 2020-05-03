/*
 * @Author: your name
 * @Date: 2020-02-17 22:39:19
 * @LastEditTime: 2020-03-20 22:58:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\components\commons\form\select\select.ts
 */
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Model, Emit, Watch } from "vue-property-decorator";

@Component
export default class SelectComponent extends Vue {
  /** 是否已进行回显，暂未使用，后续同步更新使用 */
  isEchoed: boolean = false;
  /** 是否展开 */
  isSpread: boolean = false;
  /** 是否无边框 */
  noBorder: boolean = true;
  /** 是否显示滚动条 */
  noScrollBar: boolean = true;
  /** 是否强制有值 */
  @Prop({type: Boolean, default: false})
  force!: boolean;
  /** 是否禁用 */
  @Prop({ type: Boolean, default: false })
  disabled!: boolean;
  /** 列表的键 */
  @Prop({ type: String, default: "id" })
  key$!: string;
  /** 列表的值 */
  @Prop({ type: String, default: "description" })
  value$!: string;
  /** 下拉列表源数据 */
  @Prop({ type: Array, default: () => [] })
  list!: Select[];
  list$: any = [];
  /** v-model，多选时：key数组 ，单选时：key*/
  @Model("change")
  @Prop({ default: () => null })
  model!: any[] | any;
  /** key数组,提取了_model的key,单选时，其长度为1 */
  model$: any[] = [];
  /** 是否多选 */
  @Prop({ type: Boolean, default: false })
  multiple!: boolean;
  /** 是否开启搜索,只有单选时生效 */
  @Prop({ type: Boolean, default: false })
  isSearch!: boolean;
  /** 记录window之前绑定的的onclick */
  handler: any;
  /** 输入框v-model */
  inputValue: string = "";

  get group() {
    const {list, model} = this;
    return {list,model};
  }

  /** 侦听父组件list和v-model */
  @Watch("group", { immediate: true, deep: true })
  syncWatch(nv: any, ov: any) {
    const {list: nlist, model: nmodel} = nv;
    if (nlist && nlist.length && (!ov || ov.list !== nlist)) {
      this.list$ = JSON.parse(JSON.stringify(nlist));
      if (this.isEchoed) { // 列表有变化重新回显
        this.echo();
      }
      if(!this.force) { // 没有强制选择则添加请选择到列表第一个位置
        const o: any = {};
        o[this.key$] = "";
        o[this.value$] = "请选择";
        this.list$.unshift(o);
      } else if(this.model===undefined) { // 开启了强制选择，没有设置model则默认选择第一个
        this.$emit('change', this.list$[0][this.key$]);
      }
      this.inputValue = this.inputValue$;
    }
    
    // 多选，传入的值等于当前值，则返回
    if (this.multiple && this.model$ === nmodel) return;
    // 单选，传入的值等于当前值，则返回
    if (!this.multiple && this.model$[0] === nmodel) return;
    this.echo();
  }

  echo() {
    // 单选和多选都是用checkbox来实现
    if (!(this.model instanceof Array)) {
      this.model$ = [this.model];
    } else {
      this.model$ = this.model;
    }
    // 前提list已有值，比model先传入！！！
    // 单选没有对应的值时
    if(!this.multiple&&!this.cacheMap[this.model$[0]]){
      this.model$ = [''];
    }
    // 多选无对应值时
    if(this.multiple) {
      let flag: any = !0;
      for (let i = 0, len = this.model$.length; i < len; i++) {
        flag &= <any>!!this.cacheMap[this.model$[i][this.key$]];
        if(!flag)break;
      };
      if(!flag)this.model$ = [''];
    }
    this.inputValue = this.inputValue$;
    this.isEchoed = true;
  }

  /** 将list缓存至map，提高查找速度 */
  get cacheMap() {
    const map: any = {};
    (this.list$ || []).forEach((e: any) => {
      if (!map[e[this.key$]]) map[e[this.key$]] = e;
    });
    return map;
  }
  /** 用户输入框的v-model求值，带缓存 */
  get inputValue$() {
    const arr: string[] = [];
    (this.model$ || []).forEach((id: number) => {
      const o = this.cacheMap[id];
      if (o) arr.push(o[this.value$]);
    });
    if (!arr.length) return "";
    if (arr.length <= 3) return arr.join(",");
    return arr.slice(0, 3).join(",") + "...";
  }

  constructor() {
    super();
  }

  beforeMount() {
    this.handler = window.onclick;
  }
  destroyed() {
    window.onclick = this.handler;
  }
  /**
   * 展开或关闭
   */
  toggle() {
    this.isSpread = !this.isSpread;
    if (!this.isSpread) {
      // 关闭
      this.noScrollBar = true;
      setTimeout(() => {
        this.noBorder = true;
      }, 200);
      window.onclick = this.handler;
    } else {
      // 打开
      setTimeout(() => {
        this.noScrollBar = false;
      }, 300);
      this.noBorder = false;
      // 点击本组件的外部其他元素，关闭下拉框
      window.onclick = this.toggle;
    }
  }

  /**
   * 多选选中或取消，单选选中，发射model
   */
  @Emit("change")
  change(v: any) {
    // 此时会产生一个新的model，即this.model !== this.model$!!!
    let result;
    if(this.model$.length === 0) {
        this.model$.push('');
        // result = this.model
    } else if (!this.multiple) {
      // 单选
      const o = v[this.key$];
      // 长度始终限定为1，即总是最后点击的元素，因为它是先改变了model，然后再触发事件
      if (this.model$.length > 1) this.model$ = [o];
      // 取消选中时，this.model$的长度为0，即result为undefined
      // result = this.model
      this.toggle();
    } else {
      // 多选
      if (this.model$.includes("")) {
        for (let i = 0, len = this.model$.length; i < len; i++) {
          if (this.model$[i] === "") {
            this.model$.splice(i, 1);
            break;
          }
        }
      }
    }
    result = this.model$;
    this.inputValue = this.inputValue$;
    return !this.multiple?(result[0]!==''?result[0]:''):result;
  }

  // 解耦，不用rxjs进行防抖，可自己实现一个内部的节流
  search(e: any) {
    this.debounce(e, this.realSearch, 500);
  }

  realSearch(e: any) {
    const v = e.target.value;
    this.list$ = this.list.filter((o: any) => {
      if (!v) return true;
      return o.description.indexOf(v) > -1;
    });
  }

  debounce(e: any, f: any, t: number) {
    if (f.timer) clearTimeout(f.timer);
    f.timer = setTimeout(() => {
      f(e);
    }, t);
  }
}
export interface Select {
  id: number;
  value: string;
}
