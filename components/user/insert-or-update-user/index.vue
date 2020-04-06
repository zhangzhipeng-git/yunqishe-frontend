<!--
 * @Author: your name
 * @Date: 2020-02-17 17:45:18
 * @LastEditTime: 2020-03-01 14:05:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\admin\user\components\insert-or-update-user\insert-or-update-user.vue
 -->
<template>
  <div class="wd-window-form">
    <form>
      <!-- 用户名称 -->
      <div class="wd-form-unit-h">
        <label class="required" for="">name</label>
        <input :disabled="disabled" v-model="user.name" type="text" />
      </div>
      <!-- 用户昵称 -->
      <div class="wd-form-unit-h">
        <label class="required" for="">昵称</label>
        <input :disabled="disabled" v-model="user.nickname" type="text" />
      </div>
      <!-- 用户邮箱 -->
      <div class="wd-form-unit-h">
        <label class="required" for="">邮箱</label>
        <input :disabled="disabled" v-model="user.email" type="text" />
      </div>
      <!-- 用户账号 -->
      <div class="wd-form-unit-h">
        <label class="required" for="">账号</label>
        <input :disabled="disabled" v-model="user.account" type="text" />
      </div>
      <!-- 用户密码,只有添加用户时才显示 -->
      <div class="wd-form-unit-h" v-if="operate==='insert'">
        <label class="required" for="">密码</label>
        <input v-model="user.password" type="text" />
      </div>
      <!-- 用户年龄 -->
      <div class="wd-form-unit-h">
        <label for="">年龄</label>
        <input :disabled="disabled" v-model="user.age" type="text" />
      </div>
      <!-- 用户性别 -->
      <div class="wd-form-unit-h">
        <label for="">性别</label>
        <RadioGroupComponent :disabled="disabled" v-model="user.sex" :list="radioGroup"/>
      </div>
      <!-- 用户经验 -->
      <div class="wd-form-unit-h">
        <label for="">经验</label>
        <input :disabled="disabled" v-model="user.experience" type="text" />
      </div>
      <!-- 用户硬币 -->
      <div class="wd-form-unit-h">
        <label for="">硬币</label>
        <input :disabled="disabled" v-model="user.coin" type="text" />
      </div>
      <!-- 用户上次登录时间 -->
      <div class="wd-form-unit-h">
        <label for="">上次登录时间</label>
        <input :disabled="disabled" v-model="user.lastLoginTime" type="text" />
      </div>
      <!-- 用户上次登出时间 -->
      <div class="wd-form-unit-h">
        <label for="">上次登出时间</label>
        <input :disabled="disabled" v-model="user.lastLogoutTime" type="text" />
      </div>
      <!-- 用户上次登录设备 -->
      <div class="wd-form-unit-h">
        <label for="">上次登录设备</label>
        <input :disabled="disabled" v-model="user.lastLoginDevice" type="text" />
      </div>
      <!-- 用户上次登出时间 -->
      <div class="wd-form-unit-h">
        <label for="">上次登出设备</label>
        <input :disabled="disabled" v-model="user.lastLogoutDevice" type="text" />
      </div>
      <!-- 设置状态 -->
      <div class="wd-form-unit-h">
        <label for="">设置状态</label>
        <SelectComponent
          :disabled="disabled"
          v-model="user.status"
          :list="statusList"
        />
      </div>
      <!-- 设置角色 -->
      <div class="wd-form-unit-h">
        <label for="">设置角色</label>
        <TreeComponent
          class="role-list "
          :list="roles"
          v-model="roleIDs"
        />
      </div>
    </form>
    <div class="wd-btn-group">
      <ButtonComponent @click="close" class="wd-cancle" :throttle="0" :text="'取消'" />
      <ButtonComponent @click="confirm" :text="'确认'"/>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>