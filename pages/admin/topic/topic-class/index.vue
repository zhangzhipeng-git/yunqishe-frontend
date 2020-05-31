<!--
 * @Author: your name
 * @Date: 2020-03-01 10:37:20
 * @LastEditTime: 2020-03-08 20:57:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\admin\content\invitation\classify\index.vue
 -->
<template>
  <div id="id-topic-classify">
    <!-- 标题 -->
    <div class="wd-title">话题分类</div>
    <!-- curd -->
    <div class="wd-curd-bar">
      <ButtonComponent @click="insert$" class="wd-insert"
        ><i class="icomoon icon-plus"></i>添加</ButtonComponent
      >
      <ButtonComponent @click="delete$" class="wd-delete"
        ><i class="icomoon icon-x"></i>删除</ButtonComponent
      >
      <ButtonComponent @click="batchUpdate$" class="wd-update"
        ><i class="icomoon icon-check-circle"></i>保存</ButtonComponent
      >
    </div>
    <!-- filter -->
    <div class="wd-search-bar">
      <span class="wd-form-unit-h"
        ><label for="">所属模块</label
        ><SelectComponent :force="true" v-model="searchModule" @change="searchModule$($event)" :list="modules"
      /></span>
    </div>

    <!-- 表格容器 -->
    <div class="wd-table-wrap">
      <TableComponent
        ref="table"
        :list="classify"
        :thead="['排序', '名称', '是否可见', '所属模块']"
        :columns="['sid', 'name', 'visible', 'type']"
        :operate="{ update: '保存', delete: '删除' }"
        :slots="['sid', 'name', 'visible', 'type']"
        :rows.sync="rows"
        @update="updateOne($event)"
        @delete="deleteOne($event)"
      >
        <!-- sid -->
        <template v-slot:sid="{ row }">
          <input type="text" v-model="row.sid" />
        </template>
        <!-- name -->
        <template v-slot:name="{ row }">
          <input type="text" v-model="row.name" />
        </template>
        <!-- visible -->
        <template v-slot:visible="{ row }">
          <SelectComponent
            class="select-visible"
            :list="list"
            v-model="row.visible"
          />
        </template>
        <!-- 是圈子板块还是问云分类 -->
        <template v-slot:type = "{ row }">
          {{ searchModule === 0 ? (row.type=0, "圈子") : (row.type=1,"问云") }}
        </template>
      </TableComponent>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
