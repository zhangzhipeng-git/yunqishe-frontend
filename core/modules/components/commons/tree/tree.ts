/*
 * @Author: your name
 * @Date: 2020-02-20 10:41:19
 * @LastEditTime: 2020-02-26 17:18:41
 * @LastEditors: Please set LastEditors
 * @Description: 树形组件
 * @FilePath: \nuxt-ssr\components\commons\tree\tree.ts
 */
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch, Emit, Model } from "vue-property-decorator";
import CheckBoxComponent from "../form/checkbox/checkbox.vue";
export interface Tree {
  /** 节点id */
  id: number;
  /** 节点父id */
  pid: number;
  /** 节点描述 */
  description: string;
  /** 是否展开 */
  spread?: boolean;
  /** 是否选中 */
  checked?: boolean | string;
}
interface Tree$ extends Tree {
  [key: string]: any;
  checked: boolean | string;
  spread: boolean;
  /** 父节点 */
  parent: Tree$;
  /** 子节点 */
  childs: Tree$[];
  /** 节点层级 */
  level: number;
}
interface IDS {
  checked: number[];
  nochecked: number[];
  checkedSimplify: number[];
  nocheckedSimplify: number[];
}
/**
 * 树形组件，兼容异步改变list和v-model
 */
@Component({ components: { CheckBoxComponent } })
export default class TreeComponent extends Vue {
  /** 是否已回显 */
  isEchoed: boolean = !1;
  /** 选中和未选中和对应优化的结果[如选择了父节点就不将子节点id带入结果，只带入该父节点id，父节点未选中的带入子节点id] */
  ids!: IDS;
  @Prop({ type: String, default: "id" })
  key$!: string;
  @Prop({ type: String, default: "description" })
  value$!: string;
  @Prop({ type: String, default: "cks" })
  result!: "ck" | "nck" | "cks" | "ncks";
  /** 输入的列表（没有树关系！！！），在这里构建父子关系，方便查询和遍历 */
  @Prop({ default: () => [] })
  list!: Tree[];
  /** 转换后的列表 */
  list$: Tree$[] = [];
  /** v-model */
  @Model("change")
  @Prop({ type: Array, default: () => [] })
  model!: any;
  model$: any[] = [];
  /** 侦听父组件传入的list和v-model的引用变化，v-model必须在list初始化后进行回显 */
  @Watch("group", { immediate: true, deep: true })
  syncWatch(nv: any, ov: any) {
    const { model, list } = nv;
    // 可能是异步传入的，其默认值可能为[],list$ copy from list
    // list为数组，不可为空数组，传入的值无变化则不执行
    if (list && list.length && (!ov || ov.list !== nv.list)) {
      this.initList();
      // echo回显后，但是又改变了list，则再次回显
      if (this.isEchoed) {
        this.echo();
      }
    }

    // 也可能是异步传入的，其默认值可能为[],且在list$初始化后执行
    // 前提：list$数组有可索引的元素，model$为数组，可为空数组，传入的值无变化则不执行
    if (this.list$.length && this.model$ !== model) {
      this.echo();
    }
  }
  /** 获取v-model和list，以便同时监听 */
  get group() {
    const { model, list } = this;
    return { model, list };
  }
  constructor() {
    super();
  }

  /**
   * v-model回显
   */
  echo() {
    // 如果v-model传入null或undefined
    if (this.model === null || this.model === undefined) {
      this.model = [];
    } else {
      this.model$ = this.model;
    }
    const map: any = {};
    // 重置一下
    this.list$.forEach((n: Tree$) => {
      if (!map[n[this.key$]]) map[n[this.key$]] = n;
      n.checked = false;
    });
    this.model$.forEach((id: number) => {
      const node = map[id];
      if (node) {
        node.checked = true;
        this.setChildsCheck(true, node);
        this.setParentCheck(node);
      }
    });
    this.isEchoed = !0;
  }

  /**
   * 因为是列表实现的tree，
   * 所以点击父节点进行关闭时，所有孙子和子节点都会关闭
   * 展开与关闭
   * @param v 点击的节点
   */
  toggle(v: Tree$) {
    v.childs.forEach((child: any) => {
      child.spread = !child.spread;
      if (!child.childs) return;
      // 下层子节点关闭时，则不进行显示切换
      if (!child.childs[0].spread) return;
      this.toggle(child);
    });
  }

  /**
   * CheckBoxComponent v-model变化接收函数
   * @param e 子组件CheckBoxComponent选中或取消选中的发射值：true或false
   * @param v CheckBoxComponent所在的哪个节点
   */
  @Emit("check")
  check(e: any, v: any) {
    this.ids = {
      checked: [],
      nochecked: [],
      checkedSimplify: [],
      nocheckedSimplify: []
    };
    this.setChildsCheck(e, v);
    this.setParentCheck(v);
    this.list$.forEach((row: Tree$) => {
      if (row.checked) {
        this.ids.checked.push(row[this.key$]);
        // 优化的结果id数组只存放选中的父节点id或父节点未选中的节点id
        if (!row.parent || !row.parent.checked)
          this.ids.checkedSimplify.push(row[this.key$]);
      } else {
        this.ids.nochecked.push(row[this.key$]);
        if ((!row.parent || row.parent.checked === "") && row.checked !== "")
          this.ids.nocheckedSimplify.push(row[this.key$]);
      }
    });
    this.change();
    return this.ids;
  }

  /**
   * 发射v-model
   */
  @Emit("change")
  change() {
    this.model$ = this.ids.checkedSimplify; // 传错了就用这个值
    switch (this.result) {
      case "cks":
        this.model$ = this.ids.checkedSimplify;
        break;
      case "ck":
        this.model$ = this.ids.checked;
        break;
      case "nck":
        this.model$ = this.ids.nochecked;
        break;
      case "ncks":
        this.model$ = this.ids.nocheckedSimplify;
        break;
    }
    // 此时会产生一个新的model，即this.model !== this.model$!!!
    // 把它发射出去就相等了。。。
    return this.model$;
  }

  /**
   * 设置孩子节点的checkbox选中状态
   * @param e 选中状态
   * @param v 节点
   */
  setChildsCheck(e: any, v: any) {
    if (!v.childs) return;
    // 本节点选中，则子节点都选中,反之亦然
    v.childs.forEach((c: any) => {
      c.checked = e;
      this.setChildsCheck(e, c);
    });
  }
  /**
   * 设置父亲节点的checkbox选中状态
   * @param v 节点
   */
  setParentCheck(v: any) {
    if (!v.parent) return;
    // 本节点选中，设置父节点状态
    let count = 0;
    let mcount = 0; // 半选中状态计数
    const p = v.parent;
    p.childs.forEach((child: any) => {
      if (child.checked) count++;
      if (child.checked === "") mcount++;
    });
    if (mcount) p.checked = "";
    else if (count === p.childs.length) p.checked = true;
    else if (count === 0) p.checked = false;
    else p.checked = "";
    this.setParentCheck(p);
  }

  /**
   * 初始化list$
   */
  initList() {
    const map: any = {};
    // copy，避免修改父组件数据
    this.list$ = JSON.parse(JSON.stringify(this.list));
    this.list$.forEach((n: Tree$) => {
      const id = n[this.key$];
      if (!map[id]) map[id] = n;
      // 默认顶级节点展开，子级不展开
      if (n.spread === undefined || n.spread === null) {
        let spread;
        if (n.pid === -1) spread = true;
        else spread = false;
        this.$set(n, "spread", spread);
      }
      if (n.checked === undefined || n.checked === null)
        this.$set(n, "checked", false);
    });
    this.list$.forEach((n: Tree$) => {
      const pid = n.pid;
      const parent: Tree$ = map[pid];
      if (parent) {
        n.parent = parent;
        if (!parent.childs) parent.childs = [];
        parent.childs.push(n);
      }
    });
    // list$重排序
    let arr: any[] = [];
    this.list$.forEach((n: Tree$) => {
      if (n.pid === -1) {
        const marr: any[] = [];
        marr.push(n);
        this.getChilds(n, marr);
        arr = arr.concat(marr);
      }
    });
    this.list$ = arr;
    // 设置层级，顶级设置0级
    this.list$.forEach((n: Tree$) => {
      if (n.pid === -1 || !n.pid) {
        n.level = 0;
        this.setLevel(n, 0);
      }
    });
  }
  getChilds(n: Tree$, arr: any[]) {
    if (!n.childs) return;
    n.childs.forEach((c: Tree$) => {
      arr.push(c);
      this.getChilds(c, arr);
    });
  }
  /**
   * 设置节点层级，顶级为0级
   * @param n 节点
   * @param level 层级
   */
  setLevel(n: Tree$, level: number) {
    if (!n.childs) return;
    ++level;
    n.childs.forEach((c: Tree$) => {
      c.level = level;
      this.setLevel(c, level);
    });
    --level;
  }
}
