/**
 * 基础组件
 */

import Vue from "vue";
import Component from "vue-class-component";

import App from "./context/app-context";
import AppDB from "./modules/db/AppDB";
import DomUtil from "./modules/util/dom-util";
import AppHttp from "./modules/http/app-http";
import AppSecure from "./modules/secure/app-secure";
import Cookie from "./modules/db/Cookie";
import ThirdJS from "./modules/thirdJS/third-js";
import ComponentsHandler from "./modules/components/components-handler";
import consts from "./consts";
import {HTTP_ERRORS} from './modules/http/app-http';
import LocalStorage from "./modules/db/LocalStorage";
@Component({
  mixins: [
    {
      // some functions
    }
  ]
})
export default class BaseComponent extends Vue {
  /** 类似JQuery的dom工具 */
  $$!: DomUtil;
  /** 单页存储服务，刷新页面丢失 */
  db!: AppDB;
  /** http请求服务 */
  http!: AppHttp;
  /** cookie存贮服务，服务端设置某个key为httpOnly时，无法载客户端获取 */
  cookie!: Cookie;
  /** 安全服务，用于生成会话id，获取公钥和上送密钥 */
  secure!: AppSecure;
  /** 公用组件集合服务 */
  handler!: ComponentsHandler;
  /** 懒加载第三方js服务 */
  thirdJS!: ThirdJS;
  /** localStorage,本地持久化 */
  localStorage!: LocalStorage;

  /** 当前用户 */
  get curUser() {
    const user = this.$store.state.user;
    const me = JSON.parse(JSON.stringify(user));
    this.getUserLevel(me);
    return me;
  }

  constructor() {
    super();
  }

  // 1.确保只在客户端执行;
  // 2.不用data传入，避免响应式
  beforeMount() {
    const _this: any = this;
    const app = App.getAppContext();

    _this.db = app.getDB();
    _this.http = app.getHttp();
    _this.secure = app.getSecure();
    // @ts-ignore
    _this.cookie = app.getCookie();
    // @ts-ignore
    _this.handler = app.getHandler();
    // @ts-ignore
    _this.thirdJS = app.getThirdJS();
    // @ts-ignore
    _this.localStorage = app.getLocalStorage();

    _this.$$ = DomUtil;
  }

  
  /**
   * 懒加载Echarts，执行f
   * @param f 回调
   */
  public loadEcharts(f: any) {
    this.thirdJS.loadJS(consts.JS_MAPS[0], f);
  }

  /**
   * 懒加载Emoji，执行f
   * @param f 回调
   */
  public loadEmoji(f: any) {
    this.thirdJS.loadJS(consts.JS_MAPS[1], f);
  }

  /**
   * 懒加载Amap，执行f
   * @param f 回调
   */
  private loadAMap(f: any) {
    this.thirdJS.loadJS(consts.JS_MAPS[2], f);
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
  protected toLogin() {
    const path = location.pathname;
    const loginUrl = "/login";
    this.$router.push({
      path: loginUrl,
      query: {
        fromPath: path
      }
    });
  }

  /**
   * 根据用户经验计算用户等级
   * @param  {any} user - 用户
   */
  protected async getUserLevel(user: any) {
    const experience = user.experience || 0;
    let levels = this.db.get("userLevel");
    if (!levels) {
      await this.http.get("/level/f/select/list").then((data: any) => {
        levels = data.data.levels;
        this.db.set("userLevel", levels);
      });
    }
    let i = 0;
    let lv = 0;
    let len = levels.length;
    // 计算等级
    for (; i < len; i++) {
      const level = levels[i];
      if (level.experience > experience && i - 1 >= 0) {
        console.log(levels[i - 1]);
        lv = levels[i - 1].level;
      }
    }
    if (i === len) lv = levels[len - 1].level;
    user.level = lv;
  }

  /**
   * 处理图片请求错误
   */
  protected errorImg(): void {
    if ((<any>this).onerror) return;
    (<any>this).onerror = function() {
      this.src = consts.ERROR_IMG;
    }
  }

  /**
   * 客户端所有请求用这个
   * @param  {Promise<T>} promise
   * @param  {{success?:Function} options?
   * @param  {Function}} error?
   * @returns void
   */
  protected httpRequest<T>(
    promise: Promise<any>,
    options?: { success?: Function; error?: Function }
  ): Promise<T> {
    return promise
      .then(async (data: any) => {
        if (!data) {
          // 没有数据返回
          this.handler.alert({
            content: "响应失败~",
            buttons: ["确认"]
          });
          return data;
        }

        // 是否要走默认流程
        let result = true;
        const status = data.status;
        const data$ = data.data ? data.data : data;

        if (status === 200) {
          // 成功
          if (options?.success) {
            // 成功回调
            result = await options.success(data$);
            result = result === true;
          } else {
            // 成功时没有success回调不走默认流程
            result = false;
          }
        } else if (status === 400) {
          // 失败
          if (options?.error) {
            // 失败回调
            result = await options.error(data$);
            result = result === true;
          }
        } else {
          // 未知状态，算做系统错误
          this.handler.unload();
          this.handler.alert({
            content: "系统错误，请稍后重试",
            buttons: ["确认"]
          });
          result = false;
          return data$;
        }
        // 走默认流程
        this.handler.unload();
        if (result) {
          this.handler.alert({
            content: data.tip, // 外层错误提示
            buttons: ["确认"]
          });
        }
        return data$;
      })
      .catch((error: Error) => {
        this.handler.unload();
        // 频繁请求
        if (error.message === HTTP_ERRORS.HTTP_ERROR_04) {
          this.handler.toast({text: error.message, duration: 1000});
          return;
        }
        // 其他错误
        this.handler.alert({
          content: error.message||"抱歉，应用出现了点小问题~",
          buttons: ["确认"]
        });
        console.error(error);
      });
  }
  /**
   * 获取位置信息
   * @param {{success: Function; error: Function}} 定位成功和失败回调
   * @param id 地图容器
   */
  public getLocation(options: {success: Function, error: Function},id: string = '') {
    if (!id) {
      const e = document.createElement("div");
      e.id = "iCenter";
      id = "iCenter";
    }
    this.loadAMap(() => {
      const AMap: any = (<any>window).AMap;
      if (!AMap) {
        options.error({status: 504, message: '请求超时，请检查网络是否可用~'});
        return;
      }
      const mapObj = new AMap.Map(id);
      mapObj.plugin("AMap.Geolocation", function() {
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

}
