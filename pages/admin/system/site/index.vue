<template>
  <div class="ui-site">
    <!-- 标题 -->
    <div class="wd-title">
      <span>系统管理</span>
      <span class="wd-seperator">&nbsp;/&nbsp;</span>网站信息
    </div>
    <!-- 表单 -->
    <ul formgroup ref="formGroup">
      <li>
        <InputComponent :label="'站名'" :pattern="'required'" v-model="siteInfo.siteName" />
      </li>
      <li>
        <InputComponent :label="'站长'" :pattern="'required'" v-model="siteInfo.master" />
      </li>
      <li>
        <InputComponent :label="'站长QQ'" :pattern="'required'" v-model="siteInfo.masterQQ" />
      </li>
      <li>
        <InputComponent :label="'站长微信'" :pattern="'required'" v-model="siteInfo.masterWX" />
      </li>
      <li>
        <InputComponent :label="'IPC备案号'" :pattern="'required'" v-model="siteInfo.icp" />
      </li>
      <li :style="{'text-align':'right'}">
        <ButtonComponent :disabled="!!refs.formGroup && refs.formGroup.invalid" @click="updateOne">保存</ButtonComponent>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>