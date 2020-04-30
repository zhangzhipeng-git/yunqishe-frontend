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
      <ButtonComponent @click="insert$" class="wd-insert">
        <i class="icommon icon-plus"></i>添加
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
        :list="roles"
        :trees="true"
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
    <WindowComponent
      id="id-manage-role-window"
      ref="iu_role"
      :title="title"
      :isMove="true"
      :isScale="true"
    >
      <div class="wd-window-form">
        <form :style="{'padding-bottom': '7rem'}">
          <div class="wd-form-unit-h">
            <label class="required" for>name</label>
            <input v-model="role.name" type="text" />
          </div>
          <div class="wd-form-unit-h">
            <label for>描述</label>
            <input v-model="role.description" type="text" />
          </div>
          <!-- 设置父角色 -->
          <div class="wd-form-unit-h" v-if="operate !== 'insertchild'">
            <label class="required" for>设置父角色</label>
            <SelectComponent
              :disabled="role.pid === -1"
              :isSearch="true"
              v-model="role.pid"
              :list="roles"
            />
          </div>
          <!-- 设置权限 -->
          <div class="wd-form-unit-h clearfix">
            <label class="vt required" for>设置权限</label>
            <TreeComponent class="power-list" :list="powers" v-model="powerIDs" />
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
