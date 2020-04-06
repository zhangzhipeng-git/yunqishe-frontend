<template>
  <!-- user cover -->
  <div id="id-user" ref="user_center">
    <!-- 滤镜 -->
    <div class="user-mask"></div>
    <!-- 用户详情 -->
    <div class="user-detail">
      <!-- 用户头像基本信息 -->
      <div class="user-info">
        <a @click="$refs.bg_audio.paused?$refs.bg_audio.play():$refs.bg_audio.pause()" href="javascript:void 0" class="user-avator">
          <img src="@/assets/images/default-avator.png" alt="user profile" />
        </a>
        <!-- 背景音乐 -->
        <audio autoplay preload="auto" loop ref="bg_audio">
          <source src="https:///onedrive.gimhoy.com/1drv/aHR0cHM6Ly8xZHJ2Lm1zL3UvcyFBcW4zY3FlYWhuVHppMWRSOEt4em9DTjV0RDlk.mp3" type="audio/mpeg" />
          您的浏览器不支持 audio 元素。
        </audio>
        <!-- 昵称和等级 -->
        <p>
          <span class="user-nickname">木懵の狗纸</span>
          <span
            class="user-sex icomoon"
            :class="'icon-' + (Math.random() > 0.5 ? 'venus' : 'mars')"
          ></span>
          <span class="wd-user-level user-level">lv.10</span>
        </p>
        <!-- 专属称号 -->
        <p>
          <span
            class="user-label"
            :class="{
              'wd-user-vip': i === 0,
              'wd-user-description': i === 1,
              'wd-user-designation': i === 2
            }"
            v-for="(v, i) in ['无极会员', '悲行者', '青铜']"
            :key="i"
            >{{ v }}</span
          >
        </p>
        <!-- 留言 -->
        <p class="user-say">这个人很懒什么也没说~</p>
      </div>
      <!-- 用户活动 -->
      <div class="user-actions">
        <!-- 导航栏 -->
        <div class="user-action-nav">
          <ul>
            <li
              v-for="(v, i) in [
                '全部',
                '相册',
                '帖子',
                '问答',
                '音乐',
                '视频',
                '记录',
                '个性化',
                '修改资料'
              ]"
              :key="i"
            >
              <a
                @click="active(i)"
                :class="{ active: activeIndex === i }"
                href="javascript: void 0"
                >{{ v }}</a
              >
            </li>
          </ul>
        </div>
        <!-- 主体内容 -->
        <div class="user-detail-main">
          <!-- 左侧部分 -->
          <SidebarComponent class="user-main-left">
            <div class="user-evaluate">
              <ul>
                <li
                  v-for="(v, i) in [
                    { k: '关注', v: 11 },
                    { k: '粉丝', v: 112 },
                    { k: '人气', v: 44 },
                    { k: '魅力', v: 11 },
                    { k: '金币', v: 999 }
                  ]"
                  :key="i"
                >
                  <div class="user-evaluate-k">{{ v.k }}</div>
                  <div class="user-evaluate-v">{{ v.v }}</div>
                </li>
              </ul>
            </div>
            <div class="user-introduce">
              <h3 class="wd-sidebar-ctn-title">个人简介</h3>
              <ul>
                <li
                  v-for="(v, i) in [
                    { k: 'ID', v: '1' },
                    { k: '账号', v: '102jksj' },
                    { k: '昵称', v: '木猛地狗纸' },
                    { k: '性别', v: '1' },
                    { k: '位置', v: '上海' }
                  ]"
                  :key="i"
                >
                  <label class="user-introduce-k">{{ v.k }}</label>
                  <span class="user-introduce-v">{{ v.v }}</span>
                </li>
              </ul>
            </div>
            <div>
              <!-- 用户收集的神秘珍品 -->
              <div class="user-collects">
                <div class="item-mask"></div>
                <ul>
                  <li v-for="i in 10" :key="i">
                    <a class="user-collect">{{ i }}</a>
                  </li>
                </ul>
              </div>
              <!-- 用户捕获的奇妙动物 -->
              <div class="user-captures">
                <div class="item-mask"></div>
                <ul>
                  <li v-for="i in 10" :key="i">
                    <a class="user-capture">{{ i }}</a>
                  </li>
                </ul>
              </div>
              <!-- 最近访客 -->
              <div class="user-visitors">
                <div class="item-mask"></div>
                <ul>
                  <li v-for="i in 10" :key="i">
                    <a class="user-visitor">{{ i }}</a>
                  </li>
                </ul>
              </div>
            </div>
          </SidebarComponent>
          <!-- 右侧部分 -->

          <div class="user-main-right">
            <NoResultComponent v-if="true" />
            <ul v-else>
              <li v-for="(v, i) in ['s', 's', 's']" :key="i">
                <div>{{ v }}</div>
              </li>
            </ul>
            <!-- 查看更多 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
