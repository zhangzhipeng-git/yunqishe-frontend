<!--
 * @Author: your name
 * @Date: 2020-02-12 22:35:27
 * @LastEditTime: 2020-02-26 14:26:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\admin\user\manage-power\index.vue
 -->
<template>
  <div id="id-manage-power">
    <!-- 标题 -->
    <div class="wd-title">权限管理</div>
    <div class="wd-curd-bar">
      <ButtonComponent @click="insert$" class="wd-insert"><i class="icomoon icon-plus"></i>添加</ButtonComponent>
      <ButtonComponent @click="select$" class="wd-select"><i class="icomoon icon-edit"></i>编辑</ButtonComponent>
      <ButtonComponent @click="delete$" class="wd-delete"><i class="icomoon icon-x"></i>删除</ButtonComponent>
    </div>
    <!-- 表格容器 -->
    <div class="wd-table-wrap">
      <TableComponent
        :tree="true"
        :list="powers"
        :columns="['id', 'name','description','createTime']"
        :thead="['ID', '权限名称', '描述', '创建时间']"
        :operate="{select:'编辑',delete:'删除',insert:'添加子节点'}"
        :rows.sync="rows"
        @select="selectOne($event)"
        @delete="deleteOne($event)"
        @insert="insertOne($event)"
      />
    </div>
    <!-- 增加或修改权限 -->
    <WindowComponent id="id-manage-power-window" ref="iu_power" :title="title" :isMove="true" :isScale="true">
      <InsertOrUpdatePowerComponent @confirm="insertOrUpdate($event)" :powers="powers" :power="power" :operate="operate"/>
    </WindowComponent>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
