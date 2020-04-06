<template>
    <div class="wd-emoji">
        <!-- 表情icon -->
        <i class="icomoon icon-smile-o" @click="switchEmojiList"></i>
        <!-- 表情列表 -->
        <ul ref="emoji_list" :class="{'ui-open': open}">
            <li v-for="(v, i) in emojis" :key="i" @click="selectEmoji(v)" >
                <a href="javascript: void 0" :title="v.title">{{v.text}}</a>
            </li>
        </ul>
    </div>
</template>
<script lang="ts" src="./emoji.ts"></script>