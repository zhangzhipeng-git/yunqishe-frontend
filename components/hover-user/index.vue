<template>
    <div class="ui-hover-user" :style="{top,left,right,bottom}">
        <div class="user-bgp"><img src="" alt="用户头像"></div>
        <div class="user-detail">
            <p class="wd-user-nickname">{{'昵称'}}<span class="wd-user-level">Lv.{{5}}</span></p>
            <p>关注<span>{{1}}</span>粉丝<span>{{2}}</span></p>
            <p class="wd-user-say">{{'念天地之悠悠，独怆然而涕下'}}</p>
            <p><ButtonComponent :text="'+关注'"/> <ButtonComponent :text="'聊天'"/></p>
        </div>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>