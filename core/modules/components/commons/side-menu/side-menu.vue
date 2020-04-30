/*
 * Project: nuxt-ssr
 * FileName: side-menu.vue
 * Author: zzp-dog
 * File Created: Saturday, 22nd February 2020 8:16:02 pm
 * description:
 * Last Modified: Friday, 10th April 2020 4:24:19 pm
 * Modified By: zzp-dog
 * Copyright © zzp-dog, All rights reserved.
 */

<template>
  <ul v-if="trees" :class="{ 'wd-side-menu-level1': trees && trees[0] && !trees[0].parent }">
    <!-- 递归显示子节点开始 -->
    <li v-for="(node, i) in trees" :key="i">
      <div
        v-if="node"
        @click.stop="itemClick(node, $event)"
      >
        <router-link
          v-if="node.name"
          :id="node.id"
          :to="node.url || $route.fullPath"
          :class="{ 'wd-active': node.active.node === node }"
        >
          <i
            v-if="node.leftIcon"
            :class="
              node.leftIcon.length === 2
                ? node.spread
                  ? node.leftIcon[1]
                  : node.leftIcon[0]
                : node.leftIcon[0]"
            class="fl"
          ></i>
          <span>{{ node.name }}</span>
          <i
            v-if="node.rightIcon"
            :class="
              node.rightIcon.length === 2
                ? node.spread
                  ? node.rightIcon[1]
                  : node.rightIcon[0]
                : node.rightIcon[0]"
            class="fr"
          ></i>
        </router-link>
      </div>
      <SideMenuComponent
        :trees="node[childKey]"
        :childKey="childKey"
        :class="'wd-side-menu-level' + (node.level + 1)"
        :style="{ height: node.spread ? node.height : '0' }"
        @navigate="$emit('navigate', $event)"
        class="wd-side-menu-height-transition"
      />
    </li>
    <!-- 递归显示子节点结束 -->
  </ul>
</template>
<script lang="ts" src="./side-menu.ts"></script>
