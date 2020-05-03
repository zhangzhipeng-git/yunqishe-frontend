<template>
  <div id="id-doc">
    <!-- 标题 -->
    <div class="wd-title">
      <a @click="goClass(1)"
        >资源管理&nbsp;-&nbsp;文档管理&nbsp;-&nbsp;一级分类</a
      >
      <template v-if="level > 1 && level < 5">
        <span class="wd-seperator">&nbsp;/&nbsp;</span>
        <a @click="goClass(2)">二级分类</a>
      </template>
      <template v-if="level > 2 && level < 5 ">
        <span class="wd-seperator">&nbsp;/&nbsp;</span>
        <a @click="goClass(3)">章</a>
      </template>
      <template v-if="level === 4">
        <span class="wd-seperator">&nbsp;/&nbsp;</span>
        <a @click="goClass(4)">节</a>
      </template>
    </div>
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
      <!-- 标题关键字检索 -->
      <span class="wd-form-unit-h">
        <label for>内容</label>
        <input v-model="searchName" type="text" />
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
    <!-- 这里的评论虽然是树形结构，但是按照列表来处理 -->
    <div class="wd-table-wrap">
      <TableComponent
        :list="list"
        :thead="['排序', '名称', '类型', '可见', '付费', '创建时间']"
        :columns="[
          'sid',
          'name',
          'level',
          'visible',
          'strategy',
          'createTime',
        ]"
        :operate="{
          select: '编辑',
          delete: '删除',
          other: level !== 4 && {
            text: level === 1 ? '二级分类' : level === 2 ? '章' : '节',
            icon: 'icon-arrow-right-circle',
          },
        }"
        :slots="['sid', 'level', 'visible', 'strategy']"
        :rows.sync="rows"
        @select="selectOne($event)"
        @delete="deleteOne($event)"
        @other="viewsChild($event)"
      >
        <!-- sid -->
        <template v-slot:sid="{ row }">
          <input type="text" v-model="row.sid" />
        </template>
        <!-- name -->
        <template v-slot:name="{ row }">
          <span :title="row.name">{{ row.name | strCut(4) }}</span>
        </template>
        <!-- level -->
        <template v-slot:level>{{
          description
        }}</template>
        <!-- visible -->
        <template v-slot:visible="{ row }">
          <SwitchComponent v-model="row.visible" />
        </template>
        <!-- strategy -->
        <template v-slot:strategy="{ row }">
          <SwitchComponent v-model="row.strategy" />
        </template>
      </TableComponent>
    </div>
    <!-- 增加或修改文档分类 -->
    <WindowComponent
      id="id-doc-window"
      ref="window"
      :title="operateTitle"
      :isMove="true"
      :isScale="true"
    >
      <div class="wd-window-form">
        <form>
          <!-- 排序id -->
          <div class="wd-form-unit-h">
            <label class="required" for="sid">排序</label>
            <input type="text" id="sid" v-model="entity.sid" />
          </div>
          <!-- 名称-->
          <div class="wd-form-unit-h">
            <label class="required" for="cname">名称</label>
            <input type="text" id="cname" v-model="entity.name" />
          </div>
          <!-- 封面 -->
          <div class="wd-form-unit-h">
            <label class="required" for="cover">封面(外链)</label>
            <input type="text" id="cover" v-model="entity.cover" />
          </div>
          <!-- 节的简介 -->
          <div v-if="level===4" class="wd-form-unit-h">
            <label class="required" for="cover">简介</label>
            <input type="text" id="cover" v-model="entity.introduce" />
          </div>
          <!-- 是否可见 -->
          <div class="wd-form-unit-h">
            <label class="required" for>可见</label>
            <div>
              <SwitchComponent v-model="entity.visible" />
            </div>
          </div>
          <!-- 是否付费 -->
          <div class="wd-form-unit-h">
            <label class="required" for>付费</label>
            <div>
              <SwitchComponent v-model="entity.strategy" />
            </div>
          </div>
          <!-- 节的内容 -->
          <div v-if="level===4" class="wd-form-unit-v editor-wrap">
            <label class="required" for>内容</label>
            <EditorComponent v-model="entity.text" />
          </div>
        </form>
        <div class="wd-btn-group">
          <ButtonComponent
            @click="close"
            class="wd-cancel"
            :throttle="0"
            :text="'取消'"
          />
          <ButtonComponent @click="confirm" :text="'确认'" />
        </div>
      </div>
    </WindowComponent>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
