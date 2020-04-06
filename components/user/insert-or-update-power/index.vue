<!--
 * @Author: your name
 * @Date: 2020-02-17 17:45:18
 * @LastEditTime: 2020-03-01 13:55:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\admin\user\components\insert-or-update-power\insert-or-update-power.vue
 -->
<template>
  <div class="wd-window-form">
    <form>
      <!-- 权限名称 -->
      <div class="wd-form-unit-h">
        <label class="required" for="">name</label>
        <input v-model="power.name" type="text" />
      </div>
      <!-- 权限描述 -->
      <div class="wd-form-unit-h">
        <label class="required" for="">描述</label>
        <input v-model="power.description" type="text" />
      </div>
      <!-- 设置父权限, 修改时才显示[此处权限过多会导致下拉框数据很多，后续改进为拖拽列表实现修改父子层级]-->
      <div class="wd-form-unit-h" v-if="operate !== 'insertchild'">
        <label class="required" for="">设置父权限</label>
        <SelectComponent
          :isSearch="true"
          :multiple="false"
          v-model="power.pid"
          :list="powers"
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
