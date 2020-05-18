<template>
    <div id="id-exchange-arg">
    <!-- 标题 -->
    <div class="wd-title">充值系统<span class="wd-seperator">&nbsp;/&nbsp;</span>云币兑换参数列表</div>
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
        :thead="['ID', '云币（枚）', '人名币（元）']"
        :columns="['id', 'coin', 'price']"
        :operate="{ update: '保存', delete: '删除' }"
        :slots="['coin', 'price']"
        :rows.sync="rows"
        @update="updateOne($event)"
        @delete="deleteOne($event)"
      >
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