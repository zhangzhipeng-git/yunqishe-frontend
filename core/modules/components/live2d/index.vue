<template>
  <div
    v-show="show"
    ref="box"
    class="ui-live2d"
    style="right:16px; bottom:64px"
    @mousedown="start"
    @touchstart="start"
  >
    <div v-show="!showBtn" id="landlord" style="left:5px;bottom:0px;">
      <!-- 消息框 -->
      <div class="message" :style="{opacity: message?1:0}" v-html="message" />
      <!-- 绘制模型 -->
      <canvas id="live2d" width="500" height="560" class="live2d" />
      <!-- 对话框（消息发送） -->
      <div v-show="showTalk" class="live_talk_input_body">
        <div class="live_talk_input_name_body">
          <input
            id="AIuserName"
            name="name"
            type="text"
            class="live_talk_name white_input"
            autocomplete="off"
            placeholder="你的名字"
          >
        </div>
        <div class="live_talk_input_text_body">
          <input
            id="AIuserText"
            v-model="text"
            name="talk"
            type="text"
            class="live_talk_talk white_input"
            autocomplete="off"
            placeholder="要和我聊什么呀？"
          >
          <button
            id="talk_send"
            type="button"
            class="live_talk_send_btn"
            :disabled="!text"
            @click="send"
          >
            发送
          </button>
        </div>
      </div>
      <!-- 未知 -->
      <input id="live_talk" name="live_talk" value="1" type="hidden">
      <!-- 右侧菜单列表 -->
      <div class="live_ico_box">
        <!-- 切换模型 -->
        <div id="switchModel" class="live_ico_item type_switch" @click="switchModel">
          <i class="icomoon icon-chevron-right" />
        </div>
        <!-- 切换为自动说话 -->
        <div
          id="showInfoBtn"
          class="live_ico_item type_info"
          @mouseover="hoverSwitchAutoSay"
          @touchstart="hoverSwitchAutoSay"
          @click="clickSwitchAutoSay"
          @mouseout="resetMessage"
        />
        <!-- 要和我聊天吗？ -->
        <div id="showTalkBtn" class="live_ico_item type_talk" @click="showTalk=!showTalk" />
        <!-- 隐藏 -->
        <div id="hideButton" class="live_ico_item type_quit" @click="showBtn=true" />
        <input id="live_statu_val" name="live_statu_val" value="0" type="hidden">
      </div>
    </div>
    <!-- 召唤模型的按钮 -->
    <div v-show="showBtn" id="open_live2d" @click="showBtn=false">
      召唤{{ model&&model.name }}
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
