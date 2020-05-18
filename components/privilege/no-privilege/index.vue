<template>
  <!-- 如果是作为插槽分发内容来使用，且要在插槽所在组件监听插槽分发内容是否存在，需要在插槽内容的顶级标签上使用v-if等，这里的v-if不生效！！！，参见/pages/media/detail中使用方式 -->
  <div class="wd-no-privilege" v-if="privilegeType > 0">
    <div class="no-privilege-wrap">
      <p class="no-privilege-tip">{{privilege.tip}}</p>
      <p class="no-privilege-btn">
        <button @click="doAction">{{privilege.text}}</button>
      </p>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
