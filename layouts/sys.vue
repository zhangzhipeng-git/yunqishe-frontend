<template>
  <div id="id-sys">
    <!-- 头部 -->
    <div class="wd-sys-header">
      <div class="sys-header-left">
        <!-- 三道杠 -->
        <div @click="toggle" class="header-left-menu">
          <div class="line1" :class="{ rotate1: isShow }"></div>
          <div
            class="line2"
            :style="{ visibility: isShow ? 'hidden' : 'visible' }"
          ></div>
          <div class="line3" :class="{ rotate2: isShow }"></div>
        </div>
        <h1>云启社管理系统</h1>
      </div>
      <div class="sys-header-right">
        <img src="@/assets/images/default-avator.png" alt="admin" />
        <div class="admin-set">
          <span @click.stop="showCenter">
            {{easyUser.name}}
            <i class="icomoon icon-caret-down"></i>
          </span>
          <ul class="admin-menu" v-show="isOpen">
            <li @click="logout"><a href="javascript: void 0"><i class="icomoon icon-log-out"></i>&nbsp;退出</a></li>
            <li @click="editProfile"><a href="javascript: void 0"><i class="icomoon icon-edit"></i>&nbsp;编辑资料</a></li>
            <li @click="updatePassword"><a href="javascript: void 0"><i class="icomoon icon-lock"></i>&nbsp;修改密码</a></li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 左侧 -->
    <div class="wd-sys-left" :class="'left-' + (isShow ? 'open' : 'close')">
      <SidebarNavComponent>
        <SideMenuComponent class="wd-side-menu" :tree="tree" />
      </SidebarNavComponent>
    </div>
    <!-- 右侧 -->
    <div class="wd-sys-main" :class="isShow?'origin-width':'full-width'">
      <Nuxt keep-alive ref="nuxt"/>
    </div>
    <!-- 弹出层 -->
    <WindowComponent id="id-admin-window" ref="window" :isMove="true" :isScale="false" :title="operateTitle">
      <!-- 编辑资料和修改密码 -->
      <EditAdminInfoComponent :SMSStatus="SMSStatus" @confirm="updateUser($event)" :sendSMS="sendSMS" :operate="operate" :user="user" :vtype="vtype"/>
    </WindowComponent>
  </div>
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Ref } from "vue-property-decorator";
import { Tree } from "@/core/modules/components/commons/side-menu/side-menu";
import SideMenuComponent from "@/core/modules/components/commons/side-menu/side-menu.vue";
import SidebarNavComponent from "@/core/modules/components/projections/sidebar-nav/sidebar-nav.vue";
import WindowComponent from "@/core/modules/components/commons/biz-alert/_window/window.vue";
import EditAdminInfoComponent from "@/components/user/edit-admin-info/index.vue";
import BaseComponent from "../core/base-component";
import EncryptUtil from "../core/modules/util/encrypt-util";
@Component({ components: { 
  SideMenuComponent, 
  SidebarNavComponent,
  WindowComponent,
  EditAdminInfoComponent
 } })
export default class SysHeaderComponent extends BaseComponent {
  /** 左侧菜单是否展开 */
  isShow: boolean = true;
  /** 下拉菜单是否展开 */
  isOpen: boolean = false;
  /** 操作类型 */
  operate: string = '';
  /** 弹出层标题 */
  operateTitle: string = '';
  /** 当前用户信息 */
  user: any = {};
  /** 验证类型,默认邮箱 */
  vtype: string = 'email';
  /** 弹出层 */
  @Ref('window')
  window!: any;
  /** 左侧菜单树 */
  tree: Tree = {
    name: "",
    spread: true,
    level: 0,
    child: [
      {
        name:'首 页',
        level:1,
        url:'/admin',
        leftIcon:['icon-home']
      },
      {
        name: "系统管理",
        level: 1,
        spread: false,
        leftIcon: ["icon-settings"],
        rightIcon: ["icon-caret-left", "icon-caret-down"],
        child: [
          { name: "登录设置", level: 2, leftIcon: ["icon-log-in"] },
          { name: "验证设置", level: 2, leftIcon: ["icon-key"] },
          { name: "操作设置", level: 2, leftIcon: ["icon-pencil-thin"] },
          { name: "接口设置", level: 2, leftIcon: ["icon-at-sign"] }
        ]
      },
      {
        name: "用户管理",
        spread: false,
        leftIcon: ["icon-user-circle"],
        level: 1,
        rightIcon: ["icon-caret-left", "icon-caret-down"],
        child: [
          {
            name: "角色管理",
            spread: false,
            url:'/admin/user/manage-role',
            leftIcon: ["icon-github-alt"],
            level: 2
          },
          {
            name: "权限管理",
            spread: false,
            url:'/admin/user/manage-power',
            leftIcon: ["icon-shield"],
            level: 2
          },
          {
            name: "人员管理",
            spread: false,
            url:'/admin/user/manage-user',
            leftIcon: ["icon-user"],
            level: 2
          }
        ]
      },
      {
        level: 1,
        name: "话题管理",
        spread: false,
        leftIcon: ["icon-box"],
        rightIcon: ["icon-caret-left", "icon-caret-down"],
        child:[
          // 帖子板块和问云分类
          {
            level:2,
            name:'话题分类',
            leftIcon:['icon-copy'],
            url:'/admin/topic/topic-classify'
          },
          // 论坛帖子和问云问答
          {
            level:2,
            name:'话题列表',
            leftIcon:['icon-list'],
            url:'/admin/topic/topic-content'
          }
        ]
      },
      {
        level: 1,
        name: "资源管理",
        spread: false,
        leftIcon: ["icon-send"],
        rightIcon: ["icon-caret-left", "icon-caret-down"],
        child:[
          {
            level:2,
            name:'文档',
            leftIcon:['icon-book'],
            rightIcon: ["icon-caret-left", "icon-caret-down"],
            child: [
              {
                level:3,
                name:'文档分类',
                url:'/admin/zhixing/doc-classify',
                leftIcon:['icon-copy']
              },
              {
                level:3,
                name:'文档内容',
                url:'/admin/zhixing/doc-content',
                leftIcon:['icon-list']
              }
            ]
          },
          {
            level:2,
            name:'视频',
            leftIcon:['icon-video'],
            rightIcon: ["icon-caret-left", "icon-caret-down"],          
          }
        ]
      },
      {
        level: 1,
        name: "回收站",
        leftIcon: ["icon-trash"],
        spread: false,
        rightIcon: ["icon-caret-left", "icon-caret-down"],
        child: [
          {
            name: "用户",
            leftIcon: ["icon-user"],
            level: 2
          },
          {
            name: "帖子",
            leftIcon: ["icon-send"],
            level: 2
          },
          {
            name: "问答",
            leftIcon: ["icon-help-circle"],
            level: 2
          },
          {
            name: "文章",
            level: 2,
            leftIcon: ["icon-book"]
          }
        ]
      },
      { name: "日志信息", level: 1, leftIcon: ["icon-database"] }
    ]
  };
  /** 验证码状态 */
  SMSStatus: number = 0;

  // 获取登录后或记住我后，进入应用的用户信息
  get easyUser() {
    return this.$store.state.user||{};
  }
  constructor() {
    super();
  }

  mounted() {
    const sysMain: any = document.getElementsByClassName('wd-sys-main')[0];
    const rsize = this.$$.getcomputedStyle(<any>document.documentElement, 'fontSize');
    const bodyHeight = document.body.offsetHeight;
    sysMain.style.height = (bodyHeight - (rsize * 3))+'px';
  }

  public toggle(): void {
    this.isShow = !this.isShow;
    const nuxt: any = this.$refs.nuxt;
    const index = nuxt.$children[0]
    // 首页图表resize
    index&&index.resize&&setTimeout(() => {
      index.resize();
    },500);
  }

  /**
   * 打开或关闭头部右侧用户信息下拉框
   */
  showCenter() {
    this.isOpen = !this.isOpen;
    if(!this.user.id) { // 没有查用户详细信息
      this.httpRequest(this.http.get('/user/select/one?id='+this.easyUser.id), {
        success: (data: any) => {
          this.user = data.user;
        }
      });
    }
  }

  /**
   * 登出
   */
  logout() {
    this.httpRequest(this.http.get('/user/logout'),{
      success: () => {
        // 去后台登录页
        this.$router.push('/admin/login_for_sys');
      }
    });
  }
  /**
   * 编辑用户资料
   */
  editProfile() {
    this.operate = 'editProfile';
    this.operateTitle = '编辑用户资料';  
    this.window.open();
  }
  /** 
   * 修改密码
   */
  updatePassword() {
    this.operate = 'changePassword';
    this.operateTitle = '修改密码';
    this.window.open();
  }

  /**
   * 更行管理信息
   */
  updateUser() {
    if(this.operate === 'changePassword') {
      this.user.password = EncryptUtil.MD5(this.user.password);
    }
    this.httpRequest(this.http.post('/user/b/update/one', this.user),{
      success: () => {
        this.isOpen = false;
        this.user.id = null; // 再次打开下拉时会重查用户信息
        this.window.close();
        this.handler.toast({text:'修改成功'});
      },
      error: (data: any) => {
        this.SMSStatus = data.status;
        return true;
      }
    });
  }

  /**
   * 发送验证码
   */
  sendSMS() {
    this.httpRequest(this.http.post('/user/sendcode', this.user.email), {
      success: () => {
        this.handler.toast({text:'验证码已发送'});
      }
    });
  }

}
</script>
<style lang="scss" scoped>
$wd-main-right: 47rem;
$wd-main-left: 12.5rem;
// 头部样式
.wd-sys-header {
  position: fixed;
  z-index: 99999;
  width: 100%;
  height: $app-header-height;
  padding: 0 1.5rem;
  line-height: $app-header-height;
  color: $white;
  border-bottom: 1px solid $gray-light-s;
  @extend %clearfix;
}
// 头部左侧
.sys-header-left {
  float: left;

  // 标题
  h1 {
    float: left;
    font-size: $font-size-large;
  }
}
// 左侧三道杠
.header-left-menu {
  float: left;
  width: 2rem;
  height: 100%;
  padding: (3rem - 0.4rem * 3 - 0.2 * 3rem)/2-0.2rem 0 0 0;
  cursor: pointer;
  .line1,
  .line2,
  .line3 {
    height: 0;
    width: 1.5rem;
    margin-top: (1.7-0.1 * 6)/3 + rem;
    border: 0.1rem solid $white;
    transition: transform 0.5s;
  }
  .rotate1 {
    width: 1.7rem;
    transform-origin: 0 0;
    transform: rotate(45deg);
  }
  .rotate2 {
    width: 1.7rem;
    transform-origin: 0 0.2rem;
    transform: rotate(-45deg);
  }
}
// 头部右侧
.sys-header-right {
  float: right;
  padding-right: 0.2rem 0;
  line-height: 3rem;
  // 管理员头像
  img {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    line-height: 1;
    vertical-align: middle;
    border-radius: 50%;
  }
  // 管理员设置选项
  .admin-set {
    position: relative;
    display: inline;
    vertical-align: middle;
    cursor: pointer;
    // 下拉菜单
    .admin-menu {
      position: absolute;
      top:1.5rem;
      right:0;
      width:7rem;
      line-height: 1;
      color: $common;
      background-color: $white;
      border-radius: .2rem;
      box-shadow: 0 1PX 3PX 0 $gray-light;
      a{
        display: block;
        padding:.2rem .5rem;
        font-size:$font-size-small;
        line-height: 1.5rem;
        &:hover{
          color:$white;
        }
      }
    }
  }
}

// 左侧菜单
.wd-sys-left {
  position: relative;
  top: $sys-header-height;
  bottom: 0;
  float: left;
  height: calc(100vh - 3rem);
  transition: width 0.5s;
  overflow-x: hidden;
  &.left-open {
    width: $wd-main-left;
  }
  &.left-close {
    width: 0;
  }
}
.wd-side-menu {
  padding-top: 1rem;
}
// 右侧主体部分
.wd-sys-main {
  position: relative;
  float: left;
  height:calc(100vh - 3rem);
  margin: $app-header-height 0 0 0;
  overflow: auto;
  transition: width 0.5s;
  &.origin-width{
    width: $wd-main-right;
  }
  &.full-width{
    width: $app-width;
  }
}
// 弹出层
// 样式穿透提取到全局[不影响其他样式，因为添加了本组件的样式属性data-v-hash]
  @at-root #id-admin-window {
    & /deep/ {
      // scale  放大（进入） -> 缩小（离开）
      .scale {
        &-enter {
          top: 10%;
          transform: scale(0);
          opacity: 0;
          filter: alpha(opacity=0);
        }

        &-active {
          top: 10%;
          transform: scale(1);
          opacity: 1;
          filter: alpha(opacity=100);
        }

        &-leave {
          top: 10%;
          transform: scale(0);
          opacity: 0;
          filter: alpha(opacity=0);
        }
      }
    }
  }
// 主题相关
@each $theme in $themes {
  $colors: map-get($theme-colors, #{$theme}); // 颜色map
  $main: map-get($colors, main); // 主色
  $main-deep: map-get($colors, main-deep); // 主色
  $main-light: map-get($colors, main-light); // 主色
  $tip: map-get($colors, tip); // 提示色
  $text: map-get($colors, text); // 字体颜色
  $title: map-get($colors, title); // 标题颜色
  $warm-title: map-get($colors, warm-title); // 醒目标题
  $nav: map-get($colors, nav); // 导航字体颜色
  $btn: map-get($colors, btn); // 按钮类颜色
  $hover: map-get($colors, hover); // 悬浮类颜色
  $active: map-get($colors, active); // 激活类颜色
  $bg: map-get($colors, bg); // 页面背景色
  $bc: map-get($colors, bc); // 输入类边框色
  $vip: map-get($colors, vip); // vip标识色
  $reverse: map-get($colors, reverse); // 反衬色
  $help: map-get($colors, help); // 辅助色
  $common: map-get($colors, common); // 通用色
  $warn: map-get($colors, warn); // 警示色

  .#{$theme} {
    #id-sys {
      .wd-sys-header {
        background-color: $main;
        .admin-menu{
          a:hover{
            background-color: $main-light;
          }
        }
      }
    }
  }
}
</style>
