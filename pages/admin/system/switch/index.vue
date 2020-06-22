<template>
  <div class="ui-switch">
    <!-- 标题 -->
    <div class="wd-title">
      <span>系统管理</span>
      <span class="wd-seperator">&nbsp;/&nbsp;</span>操作开关
    </div>
    <ul>
      <!-- 是否开启注册 -->
      <li>
        <div>
          <label for>开启注册</label>
        </div>
        <div>
          <SwitchComponent v-model="switch$.signUp" />
        </div>
      </li>
      <!-- 是否开启登录 -->
      <li>
        <div>
          <label for>开启登录</label>
        </div>
        <div>
          <SwitchComponent v-model="switch$.signIn" />
        </div>
      </li>
      <!-- 是否开启发表 -->
      <li>
        <div>
          <label for>开启发布</label>
        </div>
        <div>
          <SwitchComponent v-model="switch$.publish" />
        </div>
      </li>
      <!-- 是否开启评论 -->
      <li>
        <div>
          <label for>开启评论</label>
        </div>
        <div>
          <SwitchComponent v-model="switch$.comment" />
        </div>
      </li>
      <!-- 是否开启关注 -->
      <li>
        <div>
          <label for>开启关注/收藏</label>
        </div>
        <div>
          <SwitchComponent v-model="switch$.concern" />
        </div>
      </li>
      <!-- 死否开启点赞或反对 -->
      <li>
        <div>
          <label for>开启点赞/反对</label>
        </div>
        <SwitchComponent v-model="switch$.thumb" />
      </li>
    </ul>
    <div class="ui-btn-container">
      <ButtonComponent class="ui-btn" @click="updateOne">保存</ButtonComponent>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>