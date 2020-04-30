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
      <ButtonComponent @click="insert$" class="wd-insert">
        <i class="icomoon icon-plus"></i>添加
      </ButtonComponent>
      <ButtonComponent @click="select$" class="wd-select">
        <i class="icomoon icon-edit"></i>编辑
      </ButtonComponent>
      <ButtonComponent @click="delete$" class="wd-delete">
        <i class="icomoon icon-x"></i>删除
      </ButtonComponent>
    </div>
    <!-- 表格容器 -->
    <div class="wd-table-wrap">
      <TableComponent
        :trees="true"
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
    <WindowComponent
      id="id-manage-power-window"
      ref="iu_power"
      :title="title"
      :isMove="true"
      :isScale="true"
    >
      <div class="wd-window-form">
        <form>
          <!-- 权限名称 -->
          <div class="wd-form-unit-h">
            <label class="required" for>name</label>
            <input v-model="power.name" type="text" />
          </div>
          <!-- 权限描述 -->
          <div class="wd-form-unit-h">
            <label class="required" for>描述</label>
            <input v-model="power.description" type="text" />
          </div>
          <!-- 设置父权限, 修改时才显示[此处权限过多会导致下拉框数据很多，后续改进为拖拽列表实现修改父子层级]-->
          <div class="wd-form-unit-h" v-if="operate !== 'insertchild'">
            <label class="required" for>设置父权限</label>
            <SelectComponent :isSearch="true" :multiple="false" v-model="power.pid" :list="powers" />
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
