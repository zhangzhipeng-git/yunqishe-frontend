<!--
 * @Author: your name
 * @Date: 2020-03-08 21:12:08
 * @LastEditTime: 2020-03-15 19:04:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\admin\circle-and-circle\list\list.vue
 -->
<template>
  <div id="id-topic-content">
    <!-- 标题 -->
    <div class="wd-title">内容管理</div>
    <!-- curd -->
    <div class="wd-curd-bar">
      <ButtonComponent @click="insert$" class="wd-insert">
        <i class="icomoon icon-plus"></i>添加
      </ButtonComponent>
      <ButtonComponent @click="select$" class="wd-select">
        <i class="icomoon icon-edit"></i>编辑
      </ButtonComponent>
      <ButtonComponent @click="delete$" class="wd-delete">
        <i class="icomoon icon-x"></i>删除
      </ButtonComponent>
      <ButtonComponent @click="update$" class="wd-update">
        <i class="icomoon icon-check-circle"></i>保存
      </ButtonComponent>
      <ButtonComponent @click="search$" class="wd-search">
        <i class="icomoon icon-search"></i>搜索
      </ButtonComponent>
    </div>
    <!-- filter -->
    <div class="wd-search-bar">
      <!-- 所属模块 -->
      <span class="wd-form-unit-h ui-module">
        <label for>模块</label>
        <SelectComponent :force="true" v-model="searchModule" :list="moduleList" />
      </span>
      <!-- 标题关键字检索 -->
      <span class="wd-form-unit-h">
        <label for>标题</label>
        <input v-model="searchTitle" type="text" />
      </span>
      <!-- 所属话题分类 -->
      <span class="wd-form-unit-h">
        <label for>分类</label>
        <SelectComponent
          :key$="'id'"
          :value$="'name'"
          v-model="searchCategory"
          :list="categoryList"
        />
      </span>
      <!-- 是否可见 -->
      <span class="wd-form-unit-h">
        <label for>状态</label>
        <SelectComponent v-model="searchVisible" :list="visibleList" />
      </span>
      <!-- 是否付费 -->
      <span class="wd-form-unit-h">
        <label for>付费</label>
        <SelectComponent v-model="searchStrategy" :list="strategyList" />
      </span>
    </div>
    <!-- 表格容器 -->
    <div class="wd-table-wrap">
      <TableComponent
        :list="topicContents"
        :thead="['标题', '分类', '可见', '付费', '创建时间']"
        :columns="['title', 'pid', 'visible', 'strategy', 'createTime']"
        :operate="{ select: '编辑', delete: '删除' , other: {text: '评论',icon:'icon-arrow-right-circle'}}"
        :slots="['title','pid', 'visible', 'strategy']"
        :rows.sync="rows"
        @select="selectOne($event)"
        @delete="deleteOne($event)"
        @other="viewComments($event)"
      >
        <!-- title -->
        <template v-slot:title="{ row }">
          <span :title="row.title">{{row.title | strCut(12)}}</span>
        </template>
        <!-- category -->
        <template v-slot:pid="{ row }">
          <SelectComponent
            :force="true"
            :key$="'id'"
            :value$="'name'"
            class="select-menu"
            :list="categoryList"
            v-model="row.pid"
          />
        </template>
        <!-- visible -->
        <template v-slot:visible="{ row }">
          <SelectComponent
            :force="true"
            class="select-menu"
            :list="visibleList"
            v-model="row.visible"
          />
        </template>
        <!-- strategy -->
        <template v-slot:strategy="{ row }">
          <SelectComponent
            :force="true"
            class="select-menu"
            :list="strategyList"
            v-model="row.strategy"
          />
        </template>
      </TableComponent>
    </div>
    <!-- 分页条 -->
    <div class="wd-page-bar-wrap">
      <PageBarComponent :pageInfo="pageInfo" @toPage="toPage($event)" />
    </div>
    <!-- 增加或修改用户 -->
    <WindowComponent
      id="id-manage-topic-content-window"
      ref="window"
      :title="operateTitle"
      :isMove="true"
      :isScale="true"
    >
      <div class="wd-window-form">
        <form>
          <!-- 所属模块 -->
          <div class="wd-form-unit-v">
            <label class="required" for>模块</label>
            <input :disabled="true" :value="searchModule===0?'论坛':'问云'" type="text" />
          </div>
          <!-- 所属话题分类 -->
          <div class="wd-form-unit-v">
            <label class="required" for>分类</label>
            <SelectComponent
              :key$="'id'"
              :value$="'name'"
              :list="categoryList"
              v-model="topicContent.pid"
            />
          </div>
          <!-- 是否可见 -->
          <div class="wd-form-unit-v">
            <label class="required" for>可见</label>
            <SelectComponent
              class="trueOrFalse"
              :force="true"
              :list="list"
              v-model="topicContent.visible"
            />
          </div>
          <!-- 是否付费 -->
          <div class="wd-form-unit-v">
            <label class="required" for>付费</label>
            <SelectComponent
              class="trueOrFalse"
              :force="true"
              :list="list"
              v-model="topicContent.strategy"
            />
          </div>
          <!-- 话题内容标题 -->
          <div class="wd-form-unit-v">
            <label class="required" for>标题</label>
            <input v-model="topicContent.title" type="text" />
          </div>
          <!-- 话题内容封面 -->
          <div class="wd-form-unit-v">
            <label class="required" for>封面(暂只支持外链)</label>
            <input v-model="topicContent.cover" type="text" />
          </div>
          <!-- 话题内容摘要 -->
          <div class="wd-form-unit-v">
            <label class="required" for>摘要</label>
            <input v-model="topicContent.introduce" type="text" />
          </div>
          <!-- 话题内容主体 -->
          <div class="wd-form-unit-v">
            <label class="required" for>主体内容</label>
            <EditorComponent v-model="topicContent.text" :hasBtn="false" />
          </div>
        </form>
        <div class="wd-btn-group">
          <ButtonComponent @click="close" class="wd-cancel" :throttle="0" :text="'取消'" />
          <ButtonComponent @click="confirm" :text="'确认'" />
        </div>
      </div>
    </WindowComponent>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
