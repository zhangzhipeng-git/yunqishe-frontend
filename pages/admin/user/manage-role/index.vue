<!--
 * @Author: your name
 * @Date: 2020-02-12 22:35:27
 * @LastEditTime: 2020-03-01 15:42:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\admin\user\manage-role\index.vue
 -->
<template>
  <div id="id-manage-role">
    <!-- 标题 -->
    <div class="wd-title">角色管理</div>
    <div class="wd-curd-bar">
      <ButtonComponent @click="insert$" class="wd-insert"><i class="icommon icon-plus "></i>添加</ButtonComponent>
      <ButtonComponent @click="select$" class="wd-select"><i class="icomoon icon-edit"></i>编辑</ButtonComponent>
      <ButtonComponent @click="delete$" class="wd-delete"><i class="icomoon icon-x"></i>删除</ButtonComponent>
    </div>
    <!-- 表格容器 -->
    <div class="wd-table-wrap">
      <TableComponent
        :list="roles"
        :tree="true"
        :columns="['id', 'name','description','createTime']"
        :operate="{select:'编辑',delete:'删除',insert:'添加子节点'}"
        :thead="['ID', '角色名称', '描述', '创建时间']"
        :rows.sync="rows"
        @select="selectOne($event)"
        @delete="deleteOne($event)"
        @insert="insertOne($event)"
      />
    </div>
    <!-- 增加或修改角色 -->
    <WindowComponent id="id-manage-role-window" ref="iu_role" :title="title" :isMove="true" :isScale="true">
      <InsertOrUpdateRoleComponent :operate="operate" @confirm="insertOrUpdate($event)" :roles="roles" :powers="powers" :role="role"/>
    </WindowComponent>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
