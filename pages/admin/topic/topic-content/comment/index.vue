<!--
 * @Author: your name
 * @Date: 2020-03-08 21:12:08
 * @LastEditTime: 2020-03-16 14:47:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\admin\forum-and-wenyun\list\list.vue
 -->
<template>
  <div id="id-topic-comment">
    <!-- 标题 -->
    <div class="wd-title"><a @click="$router.back()">内容管理</a><span class="seperator">&nbsp;/&nbsp;</span>评论管理</div>
    <!-- curd -->
    <div class="wd-curd-bar">
      <ButtonComponent @click="insert$" class="wd-insert"
        ><i class="icomoon icon-plus"></i>添加</ButtonComponent
      >
      <ButtonComponent @click="select$" class="wd-select"
        ><i class="icomoon icon-edit"></i>编辑</ButtonComponent
      >
      <ButtonComponent @click="delete$" class="wd-delete"
        ><i class="icomoon icon-x"></i>删除</ButtonComponent
      >
      <ButtonComponent @click="update$" class="wd-update"
        ><i class="icomoon icon-check-circle"></i>保存</ButtonComponent
      >
      <ButtonComponent @click="search$" class="wd-search"
        ><i class="icomoon icon-search"></i>搜索</ButtonComponent
      >
    </div>
    <!-- filter -->
    <div class="wd-search-bar">
      <!-- 标题关键字检索 -->
      <span class="wd-form-unit-h"
        ><label for="">内容</label
        ><input v-model="searchText" type="text"/>
      </span>
      <!-- 是否可见 -->
      <span class="wd-form-unit-h"
        ><label for="">状态</label
        ><SelectComponent v-model="searchVisible" :list="visibleList"
      /></span>
      <!-- 是否付费 -->
      <span class="wd-form-unit-h"
        ><label for="">付费</label
        ><SelectComponent v-model="searchCharge" :list="chargeList"
      /></span>
    </div>
    <!-- 表格容器 -->
    <!-- 这里的评论虽然是树形结构，但是按照列表来处理 -->
    <div class="wd-table-wrap">
      <TableComponent
        :list="topicComments"
        :thead="[/** 列不够，id来凑^-^ */'ID', '可见', '付费', '创建时间']"
        :columns="['id', 'visible', 'charge', 'createTime']"
        :operate="{ select: '编辑', delete: '删除'}"
        :slots="['visible', 'charge']"
        :rows.sync="rows"
        @select="selectOne($event)"
        @delete="deleteOne($event)"
      >
        <!-- visible -->
        <template v-slot:visible="{ row }">
          <SelectComponent :force="true" class="select-menu" :list="visibleList" v-model="row.visible" />
        </template>
        <!-- charge -->
        <template v-slot:charge="{ row }">
          <SelectComponent :force="true" class="select-menu" :list="chargeList" v-model="row.charge" />
        </template>
      </TableComponent>
    </div>
    <!-- 分页条 -->
    <div class="wd-page-bar-wrap">
      <PageBarComponent :pageInfo="pageInfo" @toPage="toPage($event)" />
    </div>
    <!-- 增加或修改用户 -->
    <WindowComponent
      id="id-manage-topic-comment-window"
      ref="window"
      :title="operateTitle"
      :isMove="true"
      :isScale="true"
    >
      <InsertOrUpdateTopicCommentComponent
        @confirm="insertOrUpdate($event)"
        :operate="operate"
        :topicComment="topicComment"
      />
    </WindowComponent>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
