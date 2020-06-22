/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\pages\admin\email\template\index.vue
 * Created Date: Saturday, June 20th 2020, 4:51:26 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 
 * Last Modified: Saturday June 20th 2020 4:52:27 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

<template>
  <div id="id-template">
    <!-- 标题 -->
    <div class="wd-title">消息模板</div>
    <!-- curd -->
    <div class="wd-curd-bar">
      <ButtonComponent @click="select$" class="wd-select">
        <i class="icomoon icon-edit"></i>编辑
      </ButtonComponent>
      <ButtonComponent @click="delete$" class="wd-delete">
        <i class="icomoon icon-x"></i>删除
      </ButtonComponent>
      <ButtonComponent @click="update$" class="wd-update">
        <i class="icomoon icon-check-circle"></i>保存
      </ButtonComponent>
    </div>
    <!-- 表格容器 -->
    <div class="wd-table-wrap">
      <TableComponent
        :list="emailTemplates"
        :thead="['类型', '主题', '模板', '过期时间(ms)', '是否异步']"
        :columns="['type', 'subject', 'template', 'expire', 'async']"
        :operate="{ select: '编辑', delete: '删除'}"
        :slots="['type', 'subject', 'template', 'async']"
        :rows.sync="rows"
        @select="selectOne($event)"
        @delete="deleteOne($event)"
        @other="viewComments($event)"
      >
        <!-- type -->
        <template v-slot:subject="{ row }">
          {{row.typeDesc}}
        </template>
        <!-- subject -->
        <template v-slot:subject="{ row }">
          <span :title="row.subject">{{row.subject | strCut(12)}}</span>
        </template>
        <!-- template -->
        <template v-slot:template="{ row }">
          <span :title="row.template">{{row.template | strCut(12)}}</span>
        </template>
        <!-- async -->
        <template v-slot:async="{ row }">
           <SwitchComponent v-model="row.async"/>
        </template>
      </TableComponent>
    </div>
    <!-- 增加或修改模板 -->
    <WindowComponent
      id="id-template-window"
      ref="window"
      :title="operateTitle"
      :isMove="true"
      :isScale="true"
    >
      <div class="wd-window-form">
        <form>  
          <!-- 是否异步 -->
          <div class="wd-form-unit-v">
            <label class="required" for>是否异步</label>
            <SwitchComponent v-model="emailTemplate.async"/>
          </div>        
          <!-- 消息过期时间（ms） -->
          <div class="wd-form-unit-v">
            <label class="required" for>过期时间(ms)</label>
            <input v-model="emailTemplate.expire" type="text" />
          </div>
          <!-- 消息主题 -->
          <div class="wd-form-unit-v">
            <label class="required" for>主题</label>
            <input v-model="emailTemplate.subject" type="text" />
          </div>
          <!-- 消息模板 -->
          <div class="wd-form-unit-v">
            <label class="required" for>主体内容</label>
            <EditorComponent v-model="emailTemplate.template" :hasBtn="false" />
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
