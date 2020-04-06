<!--
 * @Author: your name
 * @Date: 2020-02-15 13:15:20
 * @LastEditTime: 2020-03-08 13:56:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\components\commons\table\table.vue
 -->
<template>
  <table class="wd-tree-table">
    <!-- 头 -->
    <thead>
      <tr>
        <th><CheckBoxComponent v-model="root" @change="checkAll($event)" /></th>
        <th v-for="(v, i) in thead" :key="i">{{ v }}</th>
        <th v-if="operate">操作</th>
      </tr>
    </thead>
    <!-- 体 -->
    <!-- 默认在第一列渲染树的层级,不进行树渲染时，显示为普通的表格 -->
    <tbody>
      <!-- list : array -->
      <tr v-for="(v, i) in list$" :key="i" v-show="!tree||v.$show">
        <td>
          <span
            :style="{
              cursor: tree && v.$childs ? 'pointer' : 'default',
              'padding-left': tree
                ? (v.$level - 1) * 1 + (v.$childs ? 0 : 0.875) + 'rem'
                : '0'
            }"
            ><i
              v-if="tree && v.$childs"
              class="icomoon"
              :class="' icon-caret-' + (v.$childs[0].$show ? 'down' : 'right')"
              @click="toggle(v)"
            ></i
            ><CheckBoxComponent :disabled="isDisabled(v.id)" @change="checkOne($event, v)" v-model="v.$check"
          /></span>
        </td>
        <!-- v : Object -->
        <template v-for="(name, index) in columns">
          <td :key="index">
            <!-- 非投影 -->
            <span v-if="!isSlot(name)">{{ getValue(v,name) }}</span>
            <!-- 投影 -->
            <slot v-else :name="name" :row="v"/>
          </td>
        </template>
        <td v-if="operate">
          <ButtonComponent v-if="operate.update" @click="action('update',v,i)" :disabled="isDisabled(v.id)" class="wd-update">
            <i class="icomoon icon-check-circle"></i>{{operate.update}}
          </ButtonComponent>
          <ButtonComponent v-if="operate.select" @click="action('select',v,i)" :disabled="isDisabled(v.id)" class="wd-select">
            <i class="icomoon icon-edit"></i>{{operate.select}}
          </ButtonComponent>
          <ButtonComponent v-if="operate.delete" @click="action('delete',v,i)" :disabled="isDisabled(v.id)" class="wd-delete">
            <i class="icomoon icon-x"></i>{{operate.delete}}
          </ButtonComponent>
          <ButtonComponent v-if="operate.insert" @click="action('insert',v,i)" :disabled="isDisabled(v.id)" class="wd-insert">
            <i class="icomoon icon-plus"></i>{{operate.insert}}
          </ButtonComponent>
          <!-- 其他 -->
          <ButtonComponent v-if="operate.other" @click="action('other',v,i)" :disabled="isDisabled(v.id)" class="wd-insert">
            <i class="icomoon" :class="operate.other.icon"></i>{{operate.other.text}}
          </ButtonComponent>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts" src="./table.ts"></script>
