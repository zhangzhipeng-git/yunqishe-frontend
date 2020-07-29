/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\core\modules\components\commons\side-menu\side-menu.vue
 * Created Date: Saturday, February 22nd 2020, 8:16:02 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 菜单树
 * Last Modified: Monday July 27th 2020 10:01:52 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */
<template>
  <ul v-if="trees" class="wd-side-menu" :class="{ 'wd-side-menu-level1': trees && trees[0] && !trees[0].parent }">
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
          :style="{'line-height': height}"
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
