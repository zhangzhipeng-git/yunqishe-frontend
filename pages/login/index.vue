<!--
 * @Author: your name
 * @Date: 2020-01-22 21:54:44
 * @LastEditTime : 2020-01-22 22:46:50
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\login\login.vue
 -->
<template>
  <div id="id-ui-login" :style="{'height': type==='login'?'20rem':'33rem'}">
    <div class="ui-login">
      <form>
        <div class="ui-action-tab">
          <a
            @click="switchType('login')"
            href="javascript: void 0"
            :class="type==='login'?'active':''"
          >登录</a>
          <a
            @click="switchType('regis')"
            href="javascript: void 0"
            :class="type==='regis'?'active':''"
          >注册</a>
        </div>
        <div class="wd-form-unit-v">
          <label for="account">账号</label>
          <div>
            <input id="account" @input="isDisabled" v-model="account" :placeholder="'请输入账号'" type="text" />
          </div>
        </div>
        <div class="wd-form-unit-v">
          <label for="password">密码</label>
          <div>
            <input autocomplete="off" @input="isDisabled" id="password" v-model="password" :placeholder="'请输入密码'" type="password" />
          </div>
        </div>
        <!-- 注册 -->
        <template v-if="type==='regis'">
          <div class="wd-form-unit-v">
            <label for="repassword">密码确认</label>
            <div>
              <input autocomplete="off" @input="isDisabled" id="repassword" v-model="repassword" :placeholder="'请确认密码'" type="password" />
            </div>
          </div>
          <div class="wd-form-unit-v">
            <label for="verifyType">{{vtype==='email'?'邮箱':'手机号'}}</label>
            <div>
              <input @input="isDisabled" :placeholder="'请输入'+(vtype==='email'?'邮箱':'手机号')" autocomplete="off" v-model="vTypeValue" id="verifyType" />
            </div>
          </div>
          <div class="wd-form-unit-v">
            <label for="verify">验证码</label>
            <div>
              <SMSComponent :status="status" :send="sendSMS" @input="recieveInput($event)" id="verify" v-model="verifycode" />
            </div>
          </div>
        </template>
      </form>
      <ButtonComponent class="ui-btn" :disabled="disabled" :throttleTime="2000" @click="doLoginOrRegist">{{type==='login'?'登录':'注册'}}</ButtonComponent>
      <div class="ui-other-login">
        <i class="icomoon icon-qq">&nbsp;QQ方式登录</i>
        <i class="icomoon icon-wechat">&nbsp;微信方式登录</i>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>