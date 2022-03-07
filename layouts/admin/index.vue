<template>
  <div id="id-sys">
    <!-- 头部 -->
    <div class="wd-sys-header">
      <div class="sys-header-left">
        <!-- 三道杠 -->
        <div @click="toggle" class="header-left-menu">
          <div class="line1" :class="{ rotate1: isShow }"></div>
          <div class="line2" :style="{ visibility: isShow ? 'hidden' : 'visible' }"></div>
          <div class="line3" :class="{ rotate2: isShow }"></div>
        </div>
        <h1>云启社管理系统</h1>
      </div>
      <div class="sys-header-right">
        <img src="@/assets/images/default-avator.png" alt="admin" />
        <div class="admin-set">
          <span @click.stop="showCenter">
            {{curUser&&curUser.name}}
            <i class="icomoon icon-caret-down"></i>
          </span>
          <ul class="admin-menu" v-show="isOpen">
            <li @click="logout">
              <a href="javascript: void 0">
                <i class="icomoon icon-log-out"></i>&nbsp;退出
              </a>
            </li>
            <li @click="editProfile">
              <a href="javascript: void 0">
                <i class="icomoon icon-edit"></i>&nbsp;编辑资料
              </a>
            </li>
            <li @click="updatePassword">
              <a href="javascript: void 0">
                <i class="icomoon icon-lock"></i>&nbsp;修改密码
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 左侧 -->
    <div class="wd-sys-left" :class="'left-' + (isShow ? 'open' : 'close')">
      <SidebarNavComponent>
        <SideMenuComponent class="wd-side-menu" :trees="tree" />
      </SidebarNavComponent>
    </div>
    <!-- 右侧 -->
    <div class="wd-sys-main" :class="isShow?'origin-width':'full-width'">
      <keep-alive>
        <router-view ref="nuxt" />
      </keep-alive>
    </div>
    <!-- 弹出层 -->
    <WindowComponent
      id="id-admin-window"
      ref="window"
      :isMove="true"
      :isScale="false"
      :title="operateTitle"
    >
      <div class="wd-window-form">
        <form>
          <template v-if="operate === 'editProfile'">
            <!-- 用户名称 -->
            <div class="wd-form-unit-v">
              <label class="required" for>姓名</label>
              <div>
                <input v-model="user.name" type="text" />
              </div>
            </div>
            <!-- 用户昵称 -->
            <div class="wd-form-unit-v">
              <label class="required" for>昵称</label>
              <div>
                <input v-model="user.nickname" type="text" />
              </div>
            </div>
            <!-- 用户邮箱 -->
            <div class="wd-form-unit-v">
              <label class="required" for>邮箱</label>
              <div>
                <input v-model="user.email" type="text" />
              </div>
            </div>
            <!-- 用户年龄 -->
            <div class="wd-form-unit-v">
              <label for>年龄</label>
              <div>
                <input v-model="user.age" type="text" />
              </div>
            </div>
            <!-- 用户性别 -->
            <div class="wd-form-unit-v">
              <label for>性别</label>
              <div>
                <SelectComponent
                  :force="true"
                  class="select-sex"
                  v-model="user.sex"
                  :list="sexList"
                />
              </div>
            </div>
            <!-- 用户经验 -->
            <div class="wd-form-unit-v">
              <label for>经验</label>
              <div>
                <input v-model="user.experience" type="text" />
              </div>
            </div>
            <!-- 用户硬币 -->
            <div class="wd-form-unit-v">
              <label for>硬币</label>
              <div>
                <input v-model="user.coin" type="text" />
              </div>
            </div>
          </template>
          <template v-else>
            <!-- 用户账号 -->
            <div class="wd-form-unit-v">
              <label for>帐&nbsp;&nbsp;号</label>
              <div>
                <input :disabled="true" :value="user.account" type="text" />
              </div>
            </div>
            <div class="wd-form-unit-v">
              <label for="password">密码</label>
              <div>
                <input
                  autocomplete="off"
                  id="password"
                  v-model="user.password"
                  :placeholder="'请输入密码'"
                  type="password"
                />
              </div>
            </div>
            <div class="wd-form-unit-v">
              <label for="repassword">密码确认</label>
              <div>
                <input
                  autocomplete="off"
                  id="repassword"
                  v-model="repassword"
                  :placeholder="'请确认密码'"
                  type="password"
                />
              </div>
            </div>
            <div class="wd-form-unit-v">
              <label for="verifyType">{{vtype === "email" ? "邮箱" : "手机号"}}</label>
              <div>
                <input
                  :placeholder="'请输入' + (vtype === 'email' ? '邮箱' : '手机号')"
                  autocomplete="off"
                  v-model="user[vtype]"
                  id="verifyType"
                />
              </div>
            </div>
            <div class="wd-form-unit-v">
              <label for="verify">验证码</label>
              <div>
                <SMSComponent id="verify" :send="sendSMS" :status="SMSStatus" v-model="user.code" />
              </div>
            </div>
          </template>
        </form>
        <div class="wd-btn-group">
          <ButtonComponent @click="close" class="wd-cancel" :throttle="0" :text="'取消'" />
          <ButtonComponent @click="confirm" :text="'确认'" />
        </div>
      </div>
    </WindowComponent>
    <!-- 工具列表 -->
    <div class="ui-tool-list">
      <ul>
        <li v-for="(v, i) in [1]" :key="i">
          <a href="javascript: void 0" @click="togglePageSet(i)" :class="{active: showPageSet}">
            <i class="icomoon icon-t-shirt"></i>
          </a>
        </li>
      </ul>
    </div>
    <!-- 主题样式设置 -->
    <div class="ui-page-set" :class="showPageSet?'show':'hide'">
      <div class="ui-mask"></div>
      <div class="ui-close" @click="togglePageSet"><i class="icomoon icon-chevrons-down"></i></div>
      <!-- 改变页眉和页脚 -->
      <div class="ui-bg">
       <span>头部/底部背景</span><SwitchComponent class="ui-switch" v-model="bg" @click="changeBg($event)" />
      </div>
      <div class="ui-theme">
        <ul>
          <li v-for="(v, i) in [
            {des: '少女粉', clz: 'r'},
            {des: '天空蓝', clz: 'b'},
            {des: '尊贵紫', clz: 'p'},
            {des: '护眼绿', clz: 'g'}
          ]" :key="i" @click="chooseTheme(v, i)">
            <a href="javascript: void 0" :class="'ui-'+v.clz + (theme === v.clz?' active':'')">
              <span>{{v.des}}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>