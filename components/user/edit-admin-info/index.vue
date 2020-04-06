<!--
 * @Author: your name
 * @Date: 2020-02-17 17:45:18
 * @LastEditTime: 2020-03-19 20:48:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\admin\user\components\insert-or-update-user\insert-or-update-user.vue
 -->
<template>
  <div class="wd-window-form">
    <form>
      <template v-if="operate === 'editProfile'">
        <!-- 用户名称 -->
        <div class="wd-form-unit-v">
          <label class="required" for="">姓名</label>
          <div>
            <input v-model="user.name" type="text" />
          </div>
        </div>
        <!-- 用户昵称 -->
        <div class="wd-form-unit-v">
          <label class="required" for="">昵称</label>
          <div>
            <input v-model="user.nickname" type="text" />
          </div>
        </div>
        <!-- 用户邮箱 -->
        <div class="wd-form-unit-v">
          <label class="required" for="">邮箱</label>
          <div>
            <input v-model="user.email" type="text" />
          </div>
        </div>
        <!-- 用户年龄 -->
        <div class="wd-form-unit-v">
          <label for="">年龄</label>
          <div>
            <input v-model="user.age" type="text" />
          </div>
        </div>
        <!-- 用户性别 -->
        <div class="wd-form-unit-v">
          <label for="">性别</label>
          <div>
            <SelectComponent :force="true" class="select-sex" v-model="user.sex" :list="sexList" />
          </div>
        </div>
        <!-- 用户经验 -->
        <div class="wd-form-unit-v">
          <label for="">经验</label>
          <div><input v-model="user.experience" type="text" /></div>
        </div>
        <!-- 用户硬币 -->
        <div class="wd-form-unit-v">
          <label for="">硬币</label>
          <div>
            <input v-model="user.coin" type="text" />
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 用户账号 -->
        <div class="wd-form-unit-v">
          <label for="">帐&nbsp;&nbsp;号</label>
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
            <SMSComponent
              id="verify"
              :send="sendSMS"
              :status="SMSStatus"
              v-model="user.code"
            />
          </div>
        </div>
      </template>
    </form>
    <div class="wd-btn-group">
      <ButtonComponent
        @click="close"
        class="wd-cancle"
        :throttle="0"
        :text="'取消'"
      />
      <ButtonComponent @click="confirm" :text="'确认'" />
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>

