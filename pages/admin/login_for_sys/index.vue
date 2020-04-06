<!--
 * @Author: your name
 * @Date: 2020-02-09 17:20:50
 * @LastEditTime: 2020-03-19 15:28:59
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\admin\login_for_sys\index.vue
 -->
<template>
  <div
    id="id-ui-login"
    :style="{ height: type === 'login' ? '20rem' : '33rem' }"
  >
    <div class="ui-login">
      <form>
        <div class="ui-action-tab">
          <a
            href="javascript: void 0"
            >云启社系统管理-{{type === 'login'?'登录':'安装'}}</a
          >
        </div>
        <div class="wd-form-unit-v">
          <label for="account">账号</label>
          <div>
            <input
              id="account"
              @input="isDisabled"
              v-model="account"
              :placeholder="'请输入账号'"
              type="text"
            />
          </div>
        </div>
        <div class="wd-form-unit-v">
          <label for="password">密码</label>
          <div>
            <input
              autocomplete="off"
              @input="isDisabled"
              id="password"
              v-model="password"
              :placeholder="'请输入密码'"
              type="password"
            />
          </div>
        </div>
        <!-- 安装 -->
        <template v-if="type === 'install'">
          <div class="wd-form-unit-v">
            <label for="repassword">密码确认</label>
            <div>
              <input
                autocomplete="off"
                @input="isDisabled"
                id="repassword"
                v-model="repassword"
                :placeholder="'请确认密码'"
                type="password"
              />
            </div>
          </div>
          <div class="wd-form-unit-v">
            <label for="verifyType">{{
              vtype === "email" ? "邮箱" : "手机号"
            }}</label>
            <div>
              <input
                @input="isDisabled"
                :placeholder="
                  '请输入' + (vtype === 'email' ? '邮箱' : '手机号')
                "
                autocomplete="off"
                v-model="vTypeValue"
                id="verifyType"
              />
            </div>
          </div>
          <div class="wd-form-unit-v">
            <label for="verify">验证码</label>
            <div>
              <SMSComponent
                id="verify"
                :send="sendSMS"
                :status="status"
                v-model="verifycode"
                @input="recieveInput($event)"
              />
            </div>
          </div>
        </template>
      </form>
      <ButtonComponent
        :disabled="disabled"
        :throttleTime="2000"
        @click="doLoginOrInstall"
        class="ui-button"
        >{{ type === 'login' ? '登录' : '安装' }}</ButtonComponent
      >
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
