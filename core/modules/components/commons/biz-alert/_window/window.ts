/**
 * Filename: d:\frontend\vue\nuxt-ssr\components\commons\alert\window\window.ts
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Saturday, January 4th 2020, 1:50:11 pm
 * Author: zzp-dog
 * 弹出层window
 * Copyright (c) 2020 Your Company
 */
import Vue from "vue";
import Component from "vue-class-component";
import { Ref, Prop, Emit } from "vue-property-decorator";
/**
 * window组件（弹出层的一种）
 *
 * 在组件template引入该组件
 */
@Component
export default class WindowComponent extends Vue {
  /** 是否进入停留状态 */
  active: boolean = false;
  /** 缩小状态 */
  min = true;
  /** 弹出层引用 */
  @Ref("window") window: any;
  /** 初始不显示 */
  show: boolean = false;
  /** 动画名称 */
  @Prop({ type: String, default: "scale" })
  animation!: string;
  /** 标题 */
  @Prop({ type: String, default: "标题" })
  title!: string;
  /** 进入动画时长 */
  @Prop({ type: Number, default: 200 })
  enter!: number;
  /** 离开动画时长 */
  @Prop({ type: Number, default: 200 })
  leave!: number;
  /** 是否开启窗体放大缩小 */
  @Prop({ type: Boolean, default: false })
  isScale!: boolean;
  /** 是否启用窗口可移动 */
  @Prop({ type: Boolean, default: false })
  isMove!: boolean;
  @Ref('pannel')
  pannel: any;
  constructor() {
    super();
  }

  /**
   * 放大缩小
   * @param e 点击事件
   */
  @Emit("switchSize")
  switchSize(e: any) {
    const o: any = {};
    if (this.min) {
      // 当前状态为缩小，点击放大
      this.window.style.cssText = '';
      this.min = false;
      o.event = "maximize";
      o.delay = 0;
    } else {
      // 当前状态为放大，点击缩小
      this.window.style.cssText = this.window._minStyle;
      this.min = true;
      o.event = "minimize";
      o.delay = 0;
    }
    return o;
  }

  /**
   * 点击关闭弹窗
   * @param e 事件
   */
  @Emit("close")
  close(e: any) {
    // 设置关闭时的渐变
    // 将行内top样式消除（优先级最高会覆盖css文件中的top样式），使css中离开时的top样式生效，否则css类trans1和trans2的离开渐变不生效
    this.window.style.cssText = this.window.style.cssText.replace(
      /top:(.*)?;/,
      ""
    );
    this.window.style.transition = "all " + this.leave / 1000 + "s";
    this.active = false;
    (<any>this.$refs.mask).style.display = "none";
    // 移除
    setTimeout(() => {
      let flag = false;
      const body  = document.body;
      for (let i = 0,len=body.children.length; i < len; i++) {
        if(this.$el === body.children[i]){
          flag = true;
          break;
        }
      }
      flag&&document.body.removeChild(this.$el);
    }, this.leave);
    return {
      event: "close",
      delay: this.leave
    };
  }

  /**
   * 打开弹窗
   */
  @Emit("open")
  open() {
    document.body.appendChild(this.$el);
    (<any>this.$refs.mask).style.display = "block";
    this.show = true;
    // 改变了响应式的show后，dom更新后的操作要放到nextTick中！！！
    this.$nextTick(() => {
      // 左右居中，top用css控制
      const w = this.window.offsetWidth + 1;
      const h = this.window.offsetHeight;
      // 当前窗口大小，this.window.parentNode => position:fixed;height:100%;width:100%
      const ww = this.window.parentNode.offsetWidth;
      // 记录初次打开，最小化时的样式
      if(!(<any>this).open$) {
        const leftStyle = "left:" + (ww - w) / 2 + "px;";
        this.window.style.cssText += leftStyle;
        this.window._minStyle =
        leftStyle + "width:" + (w) + "px;";
      }
      (<any>this).open$ = true;
      // 设置打开时的渐变
      this.window.style.transition = "all " + this.enter / 1000 + "s";
      // 取消渐变，否则移动会有渐变
      setTimeout(() => {
        this.window.style.transition = "none";
      }, this.enter);
      // 进入激活状态，添加静止时类
      this.active = true;
    });

    return {
      event: "open",
      delay: this.enter
    };
  }
  /**
   * 阻止拖拽
   * @param e 拖拽事件
   */
  tragstart(e: any) {
    e.stopPropagation();
    e.preventDefault();
    e.returnValue = false;
  }
  /**
   * 开始移动
   * @param e 事件
   */
  start(e: any) {
    if (!this.min) return;
    if (!this.isMove) return;
    const point = {
      x: e.pageX || e.clientX,
      y: e.pageY || e.clientY
    };
    const dis = {
      x: this.window.offsetLeft - point.x,
      y: this.window.offsetTop - point.y
    };
    this.window._dis = dis;
    // 浏览器窗体
    window.onmouseup = this.end;
    window.onmousemove = this.move;
  }
  /**
   * 移动
   * @param e 事件
   */
  move(e: any) {
    const point = {
      x: e.pageX || e.clientX,
      y: e.pageY || e.clientY
    };
    let top = point.y + this.window._dis.y;
    let left = point.x + this.window._dis.x;
    // 当前窗口大小，this.window.parentNode => position:fixed;height:100%;width:100%
    let maxx = this.window.parentNode.clientWidth - this.window.offsetWidth;
    let maxy = this.window.parentNode.clientHeight - this.window.offsetHeight;
    if (maxx<0)maxx = 0;
    if (maxy<0)maxy = 0;
    // 判断是否越界
    if (top <= 0) {
      // y方向
      top = 0;
    } else if (top >= maxy) {
      top = maxy;
    }
    if (left <= 0) {
      // x方向
      left = 0;
    } else if (left >= maxx) {
      left = maxx-1; // 消除误差，防止右拉过度导致宽度变小
    }
    this.window.style.top = top + "px";
    this.window.style.left = left + "px";
  }
  /**
   * 停止移动
   * @param e 事件
   */
  end(e: any) {
    window.onmouseup = null;
    window.onmousemove = null;
  }
}
