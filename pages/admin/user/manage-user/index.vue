<!--
 * @Author: your name
 * @Date: 2020-02-12 22:35:27
 * @LastEditTime: 2020-03-01 20:52:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\admin\user\manage-user\index.vue
 -->
<template>
  <div id="id-manage-user">
    <!-- 标题 -->
    <div class="wd-title">人员管理</div>
    <!-- curd -->
    <div class="wd-curd-bar">
      <ButtonComponent @click="insert$" class="wd-insert"><i class="icomoon icon-plus"></i>添加</ButtonComponent>
      <ButtonComponent @click="select$" class="wd-select"><i class="icomoon icon-edit"></i>编辑</ButtonComponent>
      <ButtonComponent @click="delete$" class="wd-delete"><i class="icomoon icon-x"></i>删除</ButtonComponent>
      <ButtonComponent @click="batchUpdate$" class="wd-update"><i class="icomoon icon-check-circle"></i>保存</ButtonComponent>
      <ButtonComponent @click="search$" class="wd-search"><i class="icomoon icon-search"></i>搜索</ButtonComponent>
    </div>
    <!-- filter -->
    <div class="wd-search-bar">
      <span class="wd-form-unit-h"><label for="">姓名</label><input v-model="searchName" type="text"></span>
      <span class="wd-form-unit-h"><label for="">昵称</label><input v-model="searchNickname" type="text"></span>
      <span class="wd-form-unit-h"><label for="">性别</label><SelectComponent v-model="searchSex" :list="sexList"/></span>
      <span class="wd-form-unit-h"><label for="">状态</label><SelectComponent v-model="searchStatus" :list="statusList"/></span>
      <span class="wd-form-unit-h"><label for="">角色</label><SelectComponent v-model="searchRole" :list="roles"/></span>
    </div>
    <!-- 表格容器 -->
    <div class="wd-table-wrap">
      <TableComponent
        :list="users"
        :thead="['ID', '头像', '昵称', '姓名','性别','状态']"
        :columns="['id','avator','nickname','name','sex','status']"
        :operate="{select:'编辑',delete:'删除'}"
        :slots="['sex','status','avator']"
        :rows.sync="users$"
        @select="selectOne($event)"
        @delete="deleteOne($event)"
      >
        <!-- avator -->
        <template v-slot:avator="{row}">
          <img class="user-avator" :src="row.avator?row.avator:'https://s2.ax1x.com/2020/02/25/3Ybz11.jpg'" alt="用户头像" />
        </template>
        <!-- sex -->
        <template v-slot:sex="{row}">
          {{row.sex===-1?'保密':row.sex===1?'女':'男'}}
        </template>
        <!-- status -->
        <template v-slot:status="{row}">
          <SelectComponent class="select-status" :list="statusList" v-model="row.status"/>
        </template>
      </TableComponent>
    </div>
    <!-- 分页条 -->
    <div class="wd-page-bar-wrap">
      <PageBarComponent :pageInfo="pageInfo" @toPage="toPage($event)"/>
    </div>
    <!-- 增加或修改用户 -->
    <WindowComponent id="id-manage-user-window" ref="iu_user" :title="title" :isMove="true" :isScale="true">
      <InsertOrUpdateUserComponent @confirm="insertOrUpdate($event)" :roles="roles" :user="user" :operate="operate"/>
    </WindowComponent>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
