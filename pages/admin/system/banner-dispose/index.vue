/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\pages\admin\system\image-api\index.vue
 * Created Date: Saturday, June 20th 2020, 9:29:12 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 
 * Last Modified: Saturday June 20th 2020 10:18:26 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

<template>
  <div id="id-image-dispose">
    <!-- 标题 -->
    <div class="wd-title">banner配置</div>
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
    </div>
    <!-- filter -->
    <div class="wd-search-bar">
      <!-- 所属模块 -->
      <span class="wd-form-unit-h ui-type">
        <label for>所属模块</label>
        <SelectComponent @change="change($event)" class="select-menu" :force="true" v-model="searchType" :list="typeList" />
      </span>
    </div>
    <!-- 表格容器 -->
    <div class="wd-table-wrap">
      <TableComponent
        :list="bannerDisposes"
        :thead="['配置链接', '跳转链接', '所属', '描述']"
        :columns="['url', 'href', 'typeDesc', 'description']"
        :operate="{ select: '编辑', delete: '删除'}"
        :slots="['url','href', 'description']"
        :rows.sync="rows"
        @select="selectOne($event)"
        @delete="deleteOne($event)"
        @other="viewComments($event)"
      >
        <!-- url -->
        <template v-slot:url="{ row }">
          <span :title="row.url">{{row.url | strCut(12)}}</span>
        </template>
        <!-- href -->
        <template v-slot:href="{ row }">
          <span :title="row.href">{{row.href | strCut(12)}}</span>
        </template>
        <!-- desc -->
        <template v-slot:description="{ row }">
          <span :title="row.description">{{row.description | strCut(12)}}</span>
        </template>
      </TableComponent>
    </div>
    <!-- 分页条 -->
    <div class="wd-page-bar-wrap">
      <PageBarComponent :pageInfo="pageInfo" @toPage="toPage($event)" />
    </div>
    <!-- 增加或修改banner配置 -->
    <WindowComponent
      id="id-image-dispose-window"
      ref="window"
      :title="operateTitle"
      :isMove="true"
      :isScale="true"
    >
      <div class="wd-window-form">
        <form>
          <!-- banner配置-所属模块 -->
          <div class="wd-form-unit-h">
            <label class="required" for>所属模块</label>
            <SelectComponent
              :force="true"
              :list="typeList"
              v-model="bannerDispose.type"
            />
          </div>
          <!-- banner配置-链接-->
          <div class="wd-form-unit-h">
            <label class="required">链接链接</label>
            <!-- 微视频时searchType===5不开放上传文件 -->
            <UploadComponent
              :disabled="searchType===5"
              :hasBtn="true"
              :text="'本地上传'"
              class="ui-upload-component"
              @onchange="uploadImg($event)"
            >
              <InputComponent :placeholder="'推荐输入外链~'" v-model="bannerDispose.url" />
            </UploadComponent>
          </div>
          <!-- banner配置-跳转链接 -->
          <div class="wd-form-unit-h">
            <label class="required" for>跳转链接</label>
            <input v-model="bannerDispose.href" type="text" />
          </div>
          <!-- banner配置-描述 -->
          <div class="wd-form-unit-h">
            <label for>描述</label>
            <textarea v-model="bannerDispose.description" type="text" />
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
