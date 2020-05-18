<template>
    <div id="id-vip-arg">
    <!-- 标题 -->
    <div class="wd-title">充值系统<span class="wd-seperator">&nbsp;/&nbsp;</span>VIP时长参数列表</div>
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
    <!-- filter -->
    <div class="wd-search-bar">
      <span class="wd-form-unit-h width-auto"
        ><label for="">会员类型</label
        ><SelectComponent :force="true" v-model="searchType" @change="searchType$($event)" :list="types"
      /></span>
    </div>

    <!-- 表格容器 -->
    <div class="wd-table-wrap">
      <TableComponent
        ref="table"
        :list="list"
        :thead="['ID', '类型', '时长（月）', '云币（枚）', '人名币（元）']"
        :columns="['id', 'type', 'duration','coin', 'price']"
        :operate="{ update: '保存', delete: '删除' }"
        :slots="['type', 'duration', 'coin', 'price']"
        :rows.sync="rows"
        @update="updateOne($event)"
        @delete="deleteOne($event)"
      >
        <!-- type -->
        <template v-slot:type="{ row }">
          <SelectComponent :force="true" v-model="row.type" :list="types2"/>
        </template>
        <!-- duration -->
        <template v-slot:duration="{ row }">
          <input type="text" v-model.number="row.duration"/>
        </template>
        <!-- coin -->
        <template v-slot:coin="{ row }">
          <input type="text" v-model.number="row.coin"/>
        </template>
        <!-- price -->
        <template v-slot:price = "{ row }">
            <input type="text" v-model.number="row.price"/>        </template>
      </TableComponent>
    </div>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>