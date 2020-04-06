<!--
 * @Author: your name
 * @Date: 2020-02-17 17:45:18
 * @LastEditTime: 2020-03-01 14:11:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\admin\user\components\insert-or-update-role\insert-or-update-role.vue
 -->
<template>
  <div class="wd-window-form">
    <form :style="{'padding-bottom': '7rem'}">
      <div class="wd-form-unit-h">
        <label class="required" for="">name</label>
        <input v-model="role.name" type="text" />
      </div>
      <div class="wd-form-unit-h">
        <label for="">描述</label>
        <input v-model="role.description" type="text" />
      </div>
      <!-- 设置父角色 -->
      <div class="wd-form-unit-h" v-if="operate !== 'insertchild'">
        <label class="required" for="">设置父角色</label>
        <SelectComponent
          :disabled="role.pid === -1"
          :isSearch="true"
          v-model="role.pid"
          :list="roles"
        />
      </div>
      <!-- 设置权限 -->
      <div class="wd-form-unit-h clearfix">
        <label class="vt required " for="">设置权限</label>
        <TreeComponent
          class="power-list "
          :list="powers"
          v-model="powerIDs"
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
