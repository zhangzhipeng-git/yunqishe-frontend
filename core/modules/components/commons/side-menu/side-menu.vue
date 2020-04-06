<template>
  <!--根节点开始-->
  <div v-if="tree" @click.stop="itemClick(tree, $event)" :class="'wd-side-menu-level' + tree.level">
    <!-- 父节点链接开始 -->
    <!-- 顶级节点和没有子节点的节点不绑定点击事件 -->
    <router-link
      v-if="tree.name"
      :id="tree.id"
      :to="tree.url||'#'"
    >
      <!-- 有子节点 && 有icon选项才显示icon -->
      <i
        v-if="tree.leftIcon"
        class="fl"
        :class="
          tree.leftIcon.length === 2
            ? tree.spread
              ? tree.leftIcon[1]
              : tree.leftIcon[0]
            : tree.leftIcon[0]
        "
      ></i>
      <span>{{ tree.name }}</span>
      <i
        v-if="tree.rightIcon"
        class="fr"
        :class="
          tree.rightIcon.length === 2
            ? tree.spread
              ? tree.rightIcon[1]
              : tree.rightIcon[0]
            : tree.rightIcon[0]
        "
      ></i>
    </router-link>
    <!-- 父节点链接结束 -->

    <!-- 子节点信息开始 -->
    <!-- 是否展开子节点，当前节点的spread的为true && 有子节点 -->
    <div v-if="tree.child && tree.child.length">
      <ul
        class="wd-side-menu-height-transition"
        :style="{
          height: tree.spread ? computedHeight(tree) : '0',
          'background-color': tree.level === 0 ? 'white' : ''
        }"
      >
        <!-- 递归显示子节点开始 -->
        <li v-for="(node, i) in tree.child" :key="i">
          <SideMenuComponent :tree="node" />
        </li>
        <!-- 递归显示子节点结束 -->
      </ul>
    </div>
    <!-- 子节点信息结束 -->
  </div>
  <!--根节点结束-->
</template>
<script lang="ts" src="./side-menu.ts"></script>
