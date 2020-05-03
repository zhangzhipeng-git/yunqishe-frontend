/*
 * @Author: your name
 * @Date: 2020-02-15 13:15:29
 * @LastEditTime: 2020-03-09 19:24:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\components\commons\tree-table\tree-table.ts
 */
import Vue from "vue";
import Component from "vue-class-component";
import ButtonComponent from "../form/button/button.vue";
import CheckBoxComponent from "../form/checkbox/checkbox.vue";
import { Prop, Watch, Emit, Model } from "vue-property-decorator";
interface RESULT {
  checked: Object[];
  /** tree为true，即为树形结构时才有 */
  checkedSimplify: Object[];
}
/**
 * 接收平铺列表，如果要进行树形渲染，必须要有主键$key[默认为id]和父主键$pid[默认为pid]
 */
@Component({
  components: { CheckBoxComponent, ButtonComponent }
})
export default class TableComponent extends Vue {
  /** 是否已回显 */
  isEchoed: boolean = false;
  /** 标题复选默认不选中 */
  root: boolean | string = false;
  /** 表格头标题 */
  @Prop({ type: Array, default: () => [] })
  thead!: string[];
  /** 包含的列 */
  @Prop({ default: () => [] })
  columns!: string[];
  /** 是否要进行更新删除添加[当tree为true时可添加子节点]等操作 */
  @Prop({
    type: Object,
    default: function() {
      return { update: "编辑", delete: "删除" };
    }
  })
  operate!: string[];
  /** 是否要渲染成树形结构 */
  @Prop({ type: Boolean, default: false })
  tree!: string;
  /** 禁用行的id数组[只在tree为false时生效] */
  @Prop({ type: Array, default: () => [] })
  disabled!: number[];
  /** 复选框选中的行,以sync方式同步更新,以$index-下标为索引进行回显！！！ */
  /** 和v-model的效果类似，后期会考虑换为v-model */
  @Prop({ type: Array, default: () => [] })
  rows!: Object[];
  /** 返回选中行的类型：'cks'-优化后的，其他-未优化的 */
  @Prop({ type: String, default: "cks" })
  type!: string;
  /** 列表数组，表格体 */
  @Prop({ type: Array, default: () => [] })
  list!: any[];
  /** list的副本 */
  list$: any[] = [];
  /** 行实体的键名，默认id，tree为true时生效 */
  @Prop({ type: String, default: "id" })
  key$!: string;
  /** 行实体父主键，默认pid，tree为true时生效*/
  @Prop({ type: String, default: "pid" })
  pkey$!: string;
  /** 父组件插槽名数组，以列名作为插槽名 */
  @Prop({ type: Array, default: () => [] })
  slots!: any[];
  /** 获取list和rows组合 */
  get group() {
    const { list, rows } = this;
    return {list,rows};
  }
  /** 获取list$以$index为索引的map */
  get cacheMap() {
    const map: any = {};
    this.list$.forEach((row: any) => {
      const index = row.$index;
      if (!map[index]) map[index] = row;
    });
    return map;
  }
  /**
   * 同步监听list和rows
   */
  @Watch("group", { immediate: true, deep: true })
  syncWatch(nv: any, ov: any) {
    const { list, rows } = nv;
    if ((list && list instanceof Array) && (!ov || list !== ov.list)) {
      this.list$ = this.getInitList();
      if (this.isEchoed) {
        this.echo();
      }
    }
    if (this.list$ && (rows instanceof Array) &&(!ov||rows !== ov.rows)) {
      this.echo();
    }
  }
  /**
   * fix bug
   * list为空时，rows也置为空[]
   * @param nv 显示的list
   */
  @Watch('list$')
  watchList$(nv: any) {
    if(!nv.length){
      this.$emit('update:rows', []);
    }
  }

  constructor() {
    super();
  }

  /**
   * 获取对象的深层次的键值，如a[b][c][d][e]
   * @param v Object
   * @param name 键值 如 'name','user.name','a.b.c'
   */
  getValue(v: any, name: string): any {
    const index = name.indexOf('.');
    if(index === -1) return v[name];
    const pre = name.substring(0, index);
    const suf = name.substring(index + 1, name.length);
    return this.getValue(v[pre], suf);    
  }

  /**
   * 检测某行是否可用，在tree渲染时不使用，只针对普通列表
   * @param id 节点id
   */
  isDisabled(id: number) {
    return !this.tree && this.disabled.includes(id);
  }
  /**
   * 是否要进行插槽插入
   * @param c 列名
   */
  isSlot(c: string) {
    return this.slots.includes(c);
  }

  /**
   * 全选或全不选
   * @param e 是否全选
   */
  checkAll(e: any) {
    const obj: RESULT = {
      checked: [],
      checkedSimplify: []
    };
    this.list$.forEach((row: any) => {
      if (!this.isDisabled(row.id)) {
        row.$check = e;
      }
      if (row.$check) {
        obj.checked.push(row);
        if ((!row.$parent || !row.$parent.$check) && this.tree)
          obj.checkedSimplify.push(row);
      }
    });
    this.getRows(obj);
  }

  /**
   * 选择其中某个节点
   * @param e 是否选中
   * @param v 节点
   */
  checkOne(e: any, v: any) {
    const obj: RESULT = {
      checked: [],
      checkedSimplify: []
    };
    if (this.tree) {
      // 树形渲染
      this.setChildsCheck(e, v);
      this.setParentCheck(v);
    }
    let count = 0;
    this.list$.forEach((row: any) => {
      if (row.$check) {
        count++;
        obj.checked.push(row);
        if ((!row.$parent || !row.$parent.$check) && this.tree)
          obj.checkedSimplify.push(row);
      }
    });
    if (count === this.list$.length - this.disabled.length) this.root = true;
    else if (count === 0) this.root = false;
    else this.root = "";
    this.getRows(obj);
  }

  /**
   * 发射选中的行
   */
  getRows(obj: RESULT) {
    // 树形结构发射对象，包含有两种类型的数组
    // 1.包含父节点和所有子节点2.优化后的数组[如果选择了父节点，则不计入子节点]
    if (this.tree && this.type === "cks") {
      this.$emit("update:rows", obj.checkedSimplify);
      return;
    }
    // 非树形结构发射行数组
    this.$emit("update:rows", obj.checked);
  }

  /**
   * 设置孩子节点的checkbox选中状态
   * @param e true | false
   * @param v 节点
   */
  setChildsCheck(e: any, v: any) {
    if (!v.$childs) return;
    // 本节点选中，则子节点都选中,反之亦然
    v.$childs.forEach((c: any) => {
      c.$check = e;
      this.setChildsCheck(e, c);
    });
  }
  // 设置父亲节点的checkbox选中状态
  setParentCheck(v: any) {
    if (!v.$parent) return;
    // 本节点选中，设置父节点状态
    let count = 0;
    let mcount = 0;
    const p = v.$parent;
    p.$childs.forEach((child: any) => {
      if (child.$check) count++;
      if (child.$check === "") mcount++;
    });
    if (mcount) p.$check = "";
    else if (count === p.$childs.length) p.$check = true;
    else if (count === 0) p.$check = false;
    else p.$check = "";
    this.setParentCheck(p);
  }

  /**
   * 因为是列表实现的tree，
   * 所以点击父节点进行关闭时，所有孙子和子节点都会关闭
   * 控制子节点隐现
   * @param v 父节点
   */
  toggle(v: any) {
    v.$childs.forEach((child: any) => {
      child.$show = !child.$show;
      if (!child.$childs) return;
      // 下层子节点关闭时，则不进行显示切换
      if (!child.$childs[0].$show) return;
      this.toggle(child);
    });
  }

  /**
   * 发射操作
   * @param o 操作类型
   * @param row 行实体
   * @param index 行下标
   * @returns {Object:{row: Object;index:number}}
   * 返回行实体和行下标的对象
   */
  action(o: string, row: any, index: number) {
    this.$emit(o, { row, index });
  }
  /**
   * 获取初始化的表格体
   */
  getInitList() {
    let list = JSON.parse(JSON.stringify(this.list));
    list.forEach((row: any, i: number) => {
      // 添加索引
      row.$index = i;
      // 是否选中
      if (row.$check === null || row.$check === undefined)
        this.$set(row, "$check", false);
    });
    // 不进行树渲染
    if (!this.tree) return list;
    // 进行树渲染
    const map: any = {};
    list.forEach((row: any) => {
      if (!map[row.id]) {
        map[row.id] = row;
      }
      // 是否展开
      if (row.$show === null || row.$show === undefined)
        this.$set(row, "$show", true);
    });
    list.forEach((row: any) => {
      const row$ = map[row.pid];
      if (row$) {
        if (!row$.$childs) {
          row$.$childs = [];
        }
        row.$parent = row$;
        row$.$childs.push(row);
      }
    });
    // list重排序!!!
    let arr: any[] = [];
    list.forEach((row: any) => {
      if (row.pid === -1) {
        const marr: any = [];
        marr.push(row);
        this.getChildList(row, marr);
        arr = arr.concat(marr);
      }
    });
    list = arr;
    // 顶级节点设置为1级
    let $level = 1;
    list.forEach((row: any) => {
      if (row.pid === -1) {
        if (row.$level) return;
        row.$level = 1;
        this.setLevel(row, $level);
      }
    });
    return list;
  }

  /**
   * 回显
   */
  echo() {
    this.root = false;
    (this.list$||[]).forEach((row: any) => {
      row.$check = !1;
    });
    let count = 0;
    // rows可能不为array
    (this.rows||[]).forEach((row: any) => {
      const $index = row.$index;
      const o = this.cacheMap[$index];
      if (o) {
        o.$check = true;
        if(this.tree){
          this.setChildsCheck(true, o);
          this.setParentCheck(o);
        }
      }
    });
    this.list$.forEach((row: any) => {
      if (row.$check===true) count++;
    });
    const len = this.list$.length;
    if (count === len && count !== 0) this.root = true;
    else if (count > 0 && count < len) this.root = "";
    else this.root = false;
    this.isEchoed = true;
  }

  /**
   * 找子孙节点
   * @param row 节点
   * @param arr 存放子孙节点的数组
   */
  getChildList(row: any, arr: any[]) {
    const childs = row.$childs;
    if (childs) {
      childs.forEach((row: any) => {
        arr.push(row);
        this.getChildList(row, arr);
      });
    }
  }
  /**
   * 设置节点层级
   * @param node 节点
   * @param $level 层级
   */
  private setLevel(node: any, $level: number) {
    if (!node.$childs) return;
    ++$level;
    node.$childs.forEach((child: any) => {
      child.$level = $level;
      this.setLevel(child, $level);
    });
    --$level;
  }
}
