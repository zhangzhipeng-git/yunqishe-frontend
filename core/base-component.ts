/**
 * 基础组件,只在客户端生效，服务端禁止使用这个
 */

import Vue from 'vue';
import Component from "vue-class-component";

import App from "./context/app-context";
import AppDB from "./modules/db/AppDB";
import DomUtil from "./modules/util/dom-util";
import AppHttp from "./modules/http/app-http";
import AppSecure from "./modules/secure/app-secure";
import Cookie from "./modules/db/Cookie";
import LocalStorage from "./modules/db/LocalStorage";
import ThirdJS from "./modules/util/js-util";
import ComponentsHandler from "./modules/components/components-handler";

import consts from "./consts";
import { Context } from "@nuxt/types";
import { AppContext } from './context/app-context';
import { HTTP_ERRORS } from "./modules/http/app-http";

// 服务端引入xss，客户端同步式引入cdn的xss
if (process && process.server) {
  if (!(<any>global).filterXss) {
    (<any>global).filterXss = require('xss');
  }
}
@Component
export default class BaseComponent extends Vue {
  /** 全局存储服务 */
  db!: AppDB;
  /** http请求服务 */
  http!: AppHttp;
  /** 安全服务，用于生成会话id，获取公钥和上送密钥 */
  secure!: AppSecure;
  /** 公用组件集合服务 */
  handler!: ComponentsHandler;
  /** context */
  context!: Context;

  /** 类似JQuery的dom工具 */
  $$!: DomUtil;
  /** cookie存贮服务，服务端设置某个key为httpOnly时，无法载客户端获取 */
  cookie!: Cookie;
  /** localStorage,本地持久化 */
  localStorage!: LocalStorage;

  /**
   * 服务端和客户端都会执行
   */
  constructor() {
    super();
    const ctx: AppContext = App.getAppContext();
    this.db = ctx.getDB();
    this.http = ctx.getHttp();
    this.secure = ctx.getSecure();
    this.context = ctx.getContext();
    this.$store = this.$store || this.context.store;
    // 服务端的handler为undefined，服务端不会用到handler，这里只有客户端有handler
    // 由于asyncData的存在，客户端会在beforeMount前就用到handler！！！
    this.handler = ctx.getHandler();
  }


  //////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////client（仅客户端可用）开始/////////////////////
  //////////////////////////////////////////////////////////////////////////////
  /**
   * 只在客户端执行
   */
  beforeMount() {
    const _this: any = this;
    const ctx = App.getAppContext();
    // @ts-ignore
    _this.cookie = ctx.getCookie();
    // @ts-ignore
    _this.localStorage = ctx.getLocalStorage();
    _this.$$ = DomUtil;
  }

  /**
   * 懒加载Echarts，执行f
   * @param f 回调
   */
  protected loadEcharts(f: any) {
    ThirdJS.loadJS(consts.JS_MAPS[0], f);
  }

  /**
   * 懒加载Emoji，执行f
   * @param f 回调
   */
  protected loadEmoji(f: any) {
    ThirdJS.loadJS(consts.JS_MAPS[1], f);
  }

  /**
   * 懒加载Amap，执行f
   * @param f 回调
   */
  private loadAMap(f: any) {
    ThirdJS.loadJS(consts.JS_MAPS[2], f);
  }

  /**
   * 懒加载hljs，执行f
   * @param f 回调
   */
  private loadHljs(f: any) {
    ThirdJS.loadJS(consts.JS_MAPS[3], f);
  }

  /**
   * 重置当前页为1，没有更多为false即查看更多为true，当前显示列表为空
   */
  protected reset() {
    const _this: any = this;
    _this.pageNum = 1;
    _this.noMore = false;
    _this.list = [];
  }

  /**
   * 去登陆页
   */
  protected toLogin(nextPath?: string) {
    let path = '';
    if (nextPath) {
      path = nextPath;
    } else {
      path = location.pathname;
      let query = location.href.split('?')[1];
      if (query) {
        path += '?' + query;
      }
    }
    const loginUrl = "/login";
    this.$router.push({
      path: loginUrl,
      query: {
        fromPath: path
      }
    });
  }

  /**
   * 处理图片请求错误
   */
  protected defaultImg(ref: any): void {
    const imgs = ref.getElementsByTagName('IMG');
    imgs.forEach((img: any) => {
      img.onerror = function () {
        this.src = consts.ERROR_IMG;
      }
    })
  }

  /**
   * 高亮代码
   * @param  {any} ...args 参数
   * 
   * 1.不传参数：自动找pre code，对textContent进行代码高亮
   * 
   * 2.传入pre或code标签对象：对该对象的textContent进行代码高亮
   * 
   * 3.传入字符串和回调：对字符串进行html转义
   * 
   * 如：'>' -> '\&gt;' ， '<' -> '\&lt;' ， '&' -> '\&amp;'
   * 
   * 后返回代码高亮字符串，作为回调的参数
   */
  protected Hljs(...args: any) {
    return new Promise(res => {
      this.loadHljs(() => {
        const hljs = (<any>window).hljs;
        const b = args[0];
        const f = args[1];
        if (b) {
          if (typeof f === 'function') {
            f(hljs.highlightAuto(b).value); // 字符串转高亮html
          } else {
            hljs.highlightBlock(b)
          }
        } else {
          // 确保每次都会执行
          hljs.initHighlighting.called = false; // 标记为未调用
          hljs.initHighlighting();
        }
        res();
        // 在页面加载后执行，不适用于单页应用！！！
        // hljs.initHighlightingOnLoad();
      });
    });
  }

  /**
   * 获取位置信息
   * @param {{success: Function; error: Function}} 定位成功和失败回调
   * @param id 地图容器
   */
  protected getLocation(options: { success: Function, error: Function }, id: string = '') {
    if (!id) {
      const e = document.createElement("div");
      e.id = "iCenter";
      id = "iCenter";
    }
    this.loadAMap(() => {
      const AMap: any = (<any>window).AMap;
      if (!AMap) {
        options.error({ status: 504, message: '请求超时，请检查网络是否可用~' });
        return;
      }
      const mapObj = new AMap.Map(id);
      mapObj.plugin("AMap.Geolocation", function () {
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：无穷大
          maximumAge: 1000, //定位结果缓存1000毫秒，默认：0
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, //显示定位按钮，默认：true
          buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        mapObj.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", options.success); //返回定位信息
        AMap.event.addListener(geolocation, "error", options.error); //返回定位出错信息
      });
    });
  }
  //////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////client（仅客户端可用）结束/////////////////////
  //////////////////////////////////////////////////////////////////////////////



  //////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////universal（两端通用）开始////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  /** 当前用户 */
  get curUser() {
    const user = this.$store.state.user;
    const me = this.clone(user);
    // 只在客户端计算用户等级
    if (!process || !process.server) {
      this.getUserLevel(me);
    }
    return me;
  }

  /**
   * 获取登录状态
   */
  public isRecord(): Promise<any> {
    // 请求是否已登录或记住我
    let config: any = {};
    if (process&&process.server) { // 服务端
      config.headers['Cookie'] = this.context.req.headers['cookie'];
    }
    if (this.curUser) {
      return new Promise(res => res(this.curUser));
    };
    return this.httpRequest(this.http.get("/user/isrecord",config), {
      success: (data: any) => {
        this.db.set('user', data.user);
        this.$store.commit("setUser", data.user);
      },
      error: () => {
        this.db.set("user", null);
        this.$store.commit("setUser", null);
      }
    }).then((data: any) => { return data.user ? data.user : data });
  }

  /**
   * 深复制
   * @param o 源对象
   */
  public clone(o: any) {
    return JSON.parse(JSON.stringify(o));
  }

  /**
   * 计算用户等级和段位
   * @param user 用户
   */
  public async getUserLevelAndDan(user: any) {
    this.getUserLevel(user).then(() => {
      this.getUserDan(user);
    });
  }

  /**
   * 根据用户经验计算用户等级
   * @param  {any} user - 用户
   */
  public async getUserLevel(user: any) {
    if (!user) return;
    const experience = user.experience || 0;
    let levels = this.db.get("userLevels");
    if (!levels) {
      await this.http.get("/level/f/select/list").then((data: any) => {
        levels = data.data.levels;
        this.db.set("userLevels", levels);
      });
    }
    let i = 0;
    let lv = 0;
    let len = levels.length;
    // 计算等级
    for (; i < len; i++) {
      const level = levels[i];
      if (level.experience > experience && i - 1 >= 0) {
        lv = levels[i - 1].level;
      }
    }
    if (i === len) lv = levels[len - 1].level;
    user.level = lv;
  }

  /**
   * 黑铁，黄铜，白银，黄金，铂金，钻石，大师，星耀，王者，神行
   */
  public getUserDan(user: any) {
    if (!user) return ''
    if (!user.level) return '黑铁';
    const level = user.level;
    let d = '';
    if (0 <= level && level <= 10) d = '黑铁';
    else if (level <= 20) d = '黄铜';
    else if (level <= 30) d = '白银';
    else if (level <= 40) d = '黄金';
    else if (level <= 50) d = '铂金';
    else if (level <= 60) d = '钻石';
    else if (level <= 70) d = '大师';
    else if (level <= 80) d = '星耀';
    else if (level <= 90) d = '王者';
    else if (level <= 100) d = '神行';
    user.dan = d;
  }

  /**
   * 对所有html进行转义和过滤，用于用户的回复等
   * @param v 字符串
   */
  public xss(v: string) {
    if (!v || (process && process.server)) return '';
    let myxss1 = (<any>this).myxss1;
    if (!myxss1) {
      if (!(<any>global || window).filterXSS) return v;
      myxss1 = new (<any>global || window).filterXSS.FilterXSS({
        whiteList: [], // 白名单为空，表示过滤所有标签，stripIgnoreTag: true时会去掉tag
        // stripIgnoreTag: true, // 过滤所有非白名单标签的HTML
        stripIgnoreTagBody: ["script"] // script标签较特殊，需要过滤标签中间的内容
      });
      (<any>this).myxss1 = myxss1;
    }
    return myxss1.process(v);
  }

  /**
   * 带白名单的xss过滤，用于vhtml的过滤
   * @param v html字符串
   * @param options 设置,可配置白名单
   */
  cleanVHtml(v: string, options?: any) {
    if (!v || (process && process.server)) return '';
    let myxss2 = (<any>this).myxss2;
    if (!myxss2) {
      if (!(<any>global || window).filterXSS) return v;
      // js-xss有默认的白名单
      myxss2 = new (<any>global || window).filterXSS.FilterXSS(consts.JSXSS_OPTIONS || options);
      (<any>this).myxss2 = myxss2;
    }
    return myxss2.process(v);
  }

  /**
   * 判断当前用户是否svip，服务端也会判断
   * @returns {boolean} true - 是，false - 否
   */
  protected isSVip(): boolean {
    return (this.curUser.roleNames || '').indexOf('svip') > -1;
  }

  /**
   * 判断当前用户是否vip，服务端也会判断
   * @returns {boolean} true - 是，false - 否
   */
  protected isVip(): boolean {
    return (this.curUser.roleNames || '').indexOf('vip') > -1;
  }


  /**
   * 获取内容查看或观看或听的权限，后端同步
   * @param v 需要付费或开通会员的内容
   * @param t 1-话题内容，2-纯媒体内容，3-文档，4-用户
   * @returns {Promise<number>} 0 - 有权限，1-需要登录，2 - 需全价支付云币，3-用户需要开通会员，4-会员需要开通会员后优惠，5-优惠支付云币（会员特权）
   * 
   * 备注：当v.strategy为4时有两种不通过的情况：
   * 
   * -用户不是会员，
   * 
   * -用户未付费
   */
  protected getPrivilege(v: any, t: number): Promise<boolean | any> {
    return new Promise(res => {
      const strategy = v.strategy;
      if (1 === strategy) { // 免费
        res(0);
        return;
      }
      // 获取用户登录状态
      this.isRecord().then(() => {
        if (!this.curUser) { // 未登录
          res(1);
          return;
        }
        if (3 === strategy && this.isVip()) { // 只需开通会员，且用户已开通会员
          res(0);
          return;
        }
        if (3 === strategy && !this.isVip()) { // 只需开通会员，且用户未开通会员
          res(3);
          return;
        }
        if (4 === strategy && !this.isVip()) { // 会员优惠，且用户未开通会员
          res(4);
          return;
        }
        // 查询是否支付云币
        this.getChargeRecord(v.id, t).then(result => {
          if (1 === result) { // 已支付云币
            res(0);
            return;
          }
          if (4 === strategy) { // 需优惠支付云币
            res(5);
            return;
          }
          if (2 === strategy) { // 需全价支付云币
            res(2);
          }
        });
      })
    });
  }

  /**
   * 查询付费记录
   * @param {number} id - 内容id
   * @param {number} type - 1-话题内容，2-纯媒体内容，3-文档，4-用户
   * @returns {Promise<number>} 1-成功，0-失败
   */
  private getChargeRecord(id: number, type: number): Promise<number> {
    return this.httpRequest(this.http.get('/charge/f/select/count?id=' + id + '&type=' + type)).then((data: any) => {
      return data.result|| 0;
    });
  }

  /**
   * 获取vip时长配置参数
   * @param {number} type vip类型：1-vip,2-svip，默认vip
   */
  protected getVipArgs(type: number = 1): Promise<any> {
    let vipArgs = this.db.get('vipArgs');
    if (vipArgs) return new Promise(res => res(vipArgs)); 
    return this.httpRequest(this.http.get('/vipArg/u/select/list?type='+type)).then((data: any) => {
      vipArgs = data.vipArgs||[];
      this.db.set('vipArgs', vipArgs);
      return vipArgs;
    });
  }

  /**
   * 兼容客户端和node端的http请求wrapper
   * @param context? Nuxt api Context
   */
  public httpRequest<T>(promise: Promise<any>, options?: { success?: Function; error?: Function }, context?: Context): Promise<T> {
    if (process && process.server) { // server
      context = context || this.context;
      return promise.then(async data => {
        if (!data) { // 后台未返回数据
          context?.error({ statusCode: 500 });
          return data;
        }
        const status = data.status;
        const data$ = data.data ? data.data : data;
        if (status === 200 && options && options.success) { // 成功且有成功回调
          await options.success(data$);
          return data$;
        }
        if (status === 400 && options && options.error) { // 失败且有失败回调
          await options.error(data$);
          return data$;
        }
      }).catch(error => {
        const r = { statusCode: 500, message: error };
        context?.error(r);
        return r;
      });
    }
    // client
    return promise.then(async (data: any) => {
      if (!data) { // 没有数据返回
        this.handler.alert({
          content: '响应失败~',
          buttons: ['确认']
        });
        return data;
      }

      // 是否要走默认流程
      let result = true;
      const status = data.status;
      const data$ = data.data ? data.data : data;

      if (status === 200) { // 成功
        if (options && options.success) { // 成功回调
          result = await options.success(data$);
          result = result === true;
        } else { // 成功时没有success回调不走默认流程
          result = false;
        }
      } else if (status === 400) { // 失败
        if (options && options.error) { // 失败回调
          result = await options.error(data$);
          result = result === true;
        }
      } else { // 未知状态，算做系统错误
        this.handler.unload();
        this.handler.alert({
          content: '系统错误，请稍后重试',
          buttons: ['确认']
        });
        result = false;
        return data$;
      }
      // 走默认流程
      this.handler.unload();
      if (result) {
        this.handler.alert({
          content: data.tip, // 外层提示
          buttons: ['确认']
        })
      }
      return data$;
    }).catch((error: Error) => {
      this.handler.unload(); 
      // 频繁请求
      if (error.message === HTTP_ERRORS.HTTP_ERROR_04) {
        this.handler.toast({ text: error.message, duration: 1000 });
        return;
      }
      // 其他错误
      this.handler.alert({
        content: error.message || "抱歉，应用出现了点小问题~",
        buttons: ["确认"]
      });
      console.error(error);
    });
  }

  /**
   * 获取单例
   */
  static getSingleton(): BaseComponent {
    if (!(<any>BaseComponent).instance) {
      (<any>BaseComponent).instance = new BaseComponent();
    }
    return (<any>BaseComponent).instance;
  }
  //////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////universal（两端通用）结束////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

}
