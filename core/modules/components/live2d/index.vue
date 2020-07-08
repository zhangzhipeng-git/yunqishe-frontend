<template>
  <div
    ref="box"
    class="ui-live2d"
    v-show="show"
    @mousedown="start"
    @touchstart="start"
    style="right:16px; bottom:64px"
  >
    <div id="landlord" style="left:5px;bottom:0px;" v-show="!showBtn">
      <!-- 消息框 -->
      <div class="message" :style="{opacity: message?1:0}" v-html="message"></div>
      <!-- 绘制模型 -->
      <canvas id="live2d" width="500" height="560" class="live2d"></canvas>
      <!-- 对话框（消息发送） -->
      <div v-show="showTalk" class="live_talk_input_body">
        <div class="live_talk_input_name_body">
          <input
            name="name"
            type="text"
            class="live_talk_name white_input"
            id="AIuserName"
            autocomplete="off"
            placeholder="你的名字"
          />
        </div>
        <div class="live_talk_input_text_body">
          <input
            name="talk"
            type="text"
            class="live_talk_talk white_input"
            id="AIuserText"
            autocomplete="off"
            placeholder="要和我聊什么呀？"
            v-model="text"
          />
          <button
            type="button"
            class="live_talk_send_btn"
            id="talk_send"
            @click="send"
            :disabled="!text"
          >发送</button>
        </div>
      </div>
      <!-- 未知 -->
      <input name="live_talk" id="live_talk" value="1" type="hidden" />
      <!-- 右侧菜单列表 -->
      <div class="live_ico_box">
        <!-- 切换模型 -->
        <div id="switchModel" @click="switchModel" class="live_ico_item type_switch">
          <i class="icomoon icon-chevron-right"></i>
        </div>
        <!-- 切换为自动说话 -->
        <div
          @mouseover="hoverSwitchAutoSay"
          @touchstart="hoverSwitchAutoSay"
          @click="clickSwitchAutoSay"
          @mouseout="resetMessage"
          id="showInfoBtn"
          class="live_ico_item type_info"
        ></div>
        <!-- 要和我聊天吗？ -->
        <div @click="showTalk=!showTalk" class="live_ico_item type_talk" id="showTalkBtn"></div>
        <!-- 隐藏 -->
        <div @click="showBtn=true" class="live_ico_item type_quit" id="hideButton"></div>
        <input name="live_statu_val" id="live_statu_val" value="0" type="hidden" />
      </div>
    </div>
    <!-- 召唤模型的按钮 -->
    <div id="open_live2d" @click="showBtn=false" v-show="showBtn">召唤{{model&&model.name}}</div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>