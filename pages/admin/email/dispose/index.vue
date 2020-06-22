<template>
    <div id="id-email-dispose">
    <!-- 标题 -->
    <div class="wd-title">邮件设置<span class="wd-seperator">&nbsp;/&nbsp;</span>邮件服务</div>
    <!-- curd -->
    <div class="wd-curd-bar">
      <ButtonComponent @click="insert$" class="wd-insert"
        ><i class="icomoon icon-plus"></i>添加</ButtonComponent
      >
      <ButtonComponent @click="delete$" class="wd-delete"
        ><i class="icomoon icon-x"></i>删除</ButtonComponent
      >
      <!-- 批量保存修改 -->
      <ButtonComponent @click="batchUpdate$" class="wd-update"
        ><i class="icomoon icon-check-circle"></i>保存</ButtonComponent
      >
    </div>

    <!-- 表格容器 -->
    <div class="wd-table-wrap">
      <TableComponent
        ref="table"
        :list="list"
        :thead="['ID', '发送方', '主机', '授权码', '超时（同步发送时有效）', '启用']"
        :columns="['id', 'from', 'host','auth', 'timeOut', 'active']"
        :operate="{ update: '保存', delete: '删除' }"
        :slots="['from', 'host', 'auth', 'timeOut', 'active']"
        :rows.sync="rows"
        @update="updateOne($event)"
        @delete="deleteOne($event)"
      >
        <!-- from -->
        <template v-slot:from="{ row }">
          <input type="text" v-model="row.from" :title="row.from"/>
        </template>
        <!-- host -->
        <template v-slot:host="{ row }">
          <input type="text" v-model="row.host" :title="row.host"/>
        </template>
        <!-- auth -->
        <template v-slot:auth="{ row }">
          <input type="text" v-model="row.auth" :title="row.auth"/>
        </template>
        <!-- timeOut(ms) -->
        <template v-slot:timeOut="{ row }">
          <input type="text" v-model.number="row.timeOut"/>ms
        </template>
        <!-- active -->
        <template v-slot:active="{ row }">
           <SwitchComponent v-model="row.active" @click="activeThis(row)"/>
        </template>
      </TableComponent>
    </div>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>