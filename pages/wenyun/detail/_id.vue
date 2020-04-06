<template>
    <div id="id-ui-wenyun-detail">
        <!-- 文章/问答头部导航条 -->
    <div class="wd-content-bar">
      <i class="icomoon icon-home"></i>
      <a @click="$router.back()">问云</a>
      <i class="icomoon icon-chevron-right"></i>
      <!-- 刷新 -->
      <nuxt-link :to="'/wenyun/detail/' + id">嘻嘻嘻</nuxt-link>
    </div>
    <!-- 文章/问答作者信息 -->
    <div class="wd-content-head">
      <div class="wd-content-head-left">
        <img src="@/assets/images/default-avator.png" alt="分类封面" />
      </div>
      <div class="wd-content-head-right">
        <p class="wd-content-head-right-up">
          <span class="wd-content-name">分类名称</span>
          <span class="wd-content-concern">
            <i class="icon-plus"></i> 关注
          </span>
          <span class="wd-content-info">
            &nbsp;发帖
            <span class="wd-number-red">4</span>
            &nbsp;粉丝
            <span class="wd-number-red">14</span>
            &nbsp;关注
            <span class="wd-number-red">6</span>
          </span>
        </p>
        <p class="wd-to-you">枯木逢春不再茂，年少且惜镜边人</p>
      </div>
    </div>
    <!-- 左侧 -->
    <div class="wd-main-left">
      <!-- 文章/问答内容 -->
      <div class="wd-stair-level-0">
        <!-- 楼主 -->
        <div class="wd-stair-left-level-0 ui-first-stair">
          <p>
            <img src="@/assets/images/default-avator.png" alt />
          </p>
          <p class="wd-stair-neck">{{invitation.author.neck}}</p>
          <p class="wd-user-vip">{{invitation.author.vip}}</p>
          <p class="wd-user-description">{{invitation.author.identity}}</p>
          <p class="wd-user-designation">{{invitation.author.designation}}</p>
          <p class="wd-user-level">Lv.{{invitation.author.level}}</p>
        </div>
        <!-- 正文 -->
        <div class="wd-stair-right-level-0">
          <p>{{invitation.content}}</p>
          <!-- 发表的相关信息 -->
          <p class="wd-stair-right-deliver-level-0">
            <span class="wd-stair-right-tag-level-0">#1楼</span>
            <i class="icomoon icon-map-pin"></i>
            <span>{{invitation.address}}</span>
            <i class="icomoon icon-clock"></i>
            <span>{{invitation.time}}</span>
            <i class="icomoon icon-monitor"></i>
            <span>{{invitation.device}}</span>
            <i class="icomoon icon-eye"></i>
            <span>{{invitation.viewcount}}</span>
            <!-- 收藏 -->
            <a @click="action($event)">
              <i class="icomoon icon-star-o"></i>
              <span>{{invitation.collectcount}}</span>
            </a>
            <!-- 点赞 -->
            <a @click="action($event)">
              <i class="icomoon icon-thumbs-up-o"></i>
              <span>{{invitation.thumbupcount}}</span>
            </a>
            <a class="wd-stair-right-reply-btn-level-0">回复</a>
          </p>
        </div>
      </div>
      <!-- 简单回复 -->
      <div class="ui-reply">
        <div class="ui-reply-img">
          <img src="@/assets/images/default-avator.png" alt />
        </div>
        <div class="ui-reply-wrap">
          <ReplyComponent :payload="{id: invitation.id}" @reciveReply="reciveReply" />
        </div>
      </div>
      <!-- 文章/问答回复 -->
      <div class="wd-stair-level-1" v-for="(item, index) in invitation.reply" :key="index">
        <!-- 1级回复左侧楼层 -->
        <div class="wd-stair-left-level-1">
          <p>
            <img :src="item.author.avator" alt />
          </p>
        </div>
        <!-- 回复内容 -->
        <div class="wd-stair-right-level-1">
          <!-- 1级回复容器-->
          <div class="wd-stair-right-wrap-level-1">
            <!-- 1级回复者昵称和等级 -->
            <h4 class="wd-stair-right-wrap-head-level-1">
              <!-- 1级回复 - 第几层 -->
              <span class="wd-stair-right-wrap-head-tag-level-1">#{{index+2}}楼</span>
              <!-- 1级回复者昵称 -->
              <span class="wd-stair-right-wrap-head-neck-level-1">{{item.author.neck}}</span>
              <!-- 1级回复者等级 -->
              <span class="wd-stair-right-wrap-head-level-level-1">Lv.{{item.author.level}}</span>
            </h4>
            <!-- 1级回复内容 -->
            <p class="wd-stair-right-wrap-body-level-1">{{item.content}}</p>
            <!-- 1级回复信息条 -->
            <p class="wd-stair-right-wrap-deliver-level-1">
              <i class="icomoon icon-clock"></i>
              <span>{{item.time}}</span>
              <i class="icomoon icon-monitor"></i>
              <span>{{item.device}}</span>
              <!-- 踩顶互斥 -->
              <a>
                <i class="icomoon icon-thumbs-up-o"></i>
                <span>{{item.thumbupcount}}</span>
              </a>
              <a>
                <i class="icomoon icon-thumbs-down-o"></i>
                <span>{{item.thumbdowncount}}</span>
              </a>
              <i class="icomoon icon-message-square"></i>
              <span>{{item.replycount}}</span>
              <a class="wd-stair-right-wrap-deliver-btn-level-1">回复</a>
            </p>
          </div>
          <!-- 2级及以上回复 - 在1级回复中显示 -->
          <div class="wd-stair-level-2" v-for="(item_, index_) in item.reply" :key="index_">
            <!-- 2级回复左侧楼层 -->
            <div class="wd-stair-left-level-2">
              <p>
                <img :src="item_.author.avator" alt />
              </p>
            </div>
            <!-- 2级回复正文 -->
            <div class="wd-stair-right-level-2">
              <!-- 2级回复容器-->
              <div class="wd-stair-right-wrap-level-2">
                <!-- 2级回复者昵称和等级 -->
                <h4 class="wd-stair-right-wrap-head-level-2">
                  <!-- 2级回复第几层 -->
                  <span
                    class="wd-stair-right-wrap-head-tag-level-2"
                  >#{{(index+2) + '-' + (index_ + 1)}}楼</span>
                  <!-- 2级回复者昵称 -->
                  <span class="wd-stair-right-wrap-head-neck-level-2">{{item_.author.neck}}</span>
                  <!-- 2级回复者等级 -->
                  <span class="wd-stair-right-wrap-head-level-level-2">Lv.{{item_.author.level}}</span>
                </h4>
                <!-- 2级回复内容 -->
                <p class="wd-stair-right-wrap-body-level-2">{{item_.content}}</p>
                <!-- 2级回复信息条 -->
                <p class="wd-stair-right-wrap-deliver-level-2">
                  <i class="icomoon icon-clock"></i>
                  <span>{{item_.time}}</span>
                  <i class="icomoon icon-monitor"></i>
                  <span>{{item_.device}}</span>
                  <!-- 踩顶互斥 -->
                  <a>
                    <i class="icomoon icon-thumbs-up-o"></i>
                    <span>{{item_.thumbupcount}}</span>
                  </a>
                  <a>
                    <i class="icomoon icon-thumbs-down-o"></i>
                    <span>{{item_.thumbdowncount}}</span>
                  </a>
                  <a class="wd-stair-right-wrap-deliver-btn-level-2">回复</a>
                </p>
              </div>
            </div>
          </div>
          <!-- 2级回复 每次看5条 -->
          <p v-if="item.reply.length >= 5" class="wd-view-more-leve-2">
            <a href="javascript:void 0">查看更多</a>
          </p>
        </div>
      </div>
      <!-- 1级回复 每次看5条 -->
      <p class="wd-view-more">查看更多</p>
    </div>
    <!-- 右侧 -->
    <!-- 侧边栏组件 投影无需样式穿透 - 因为投影内容的样式会同时加上父子组件的样式标识-->
    <SidebarComponent :threshold="'-4rem'" class="wd-main-right">
      <!-- 最近浏览 -->
      <div class="wd-sidebar-ctn">
        <h3 class="wd-sidebar-ctn-title">最近浏览</h3>
        <div class="wd-sidebar-ctn-user-list">
          <ul class>
            <li v-for="n in 10" :key="n" class="wd-user-img-square">
              <img src="@/assets/images/default-avator.png" alt="用户头像" />
              <p class="wd-user-img-square-vip">V</p>
              <p class="wd-user-img-square-honor">vip</p>
              <p class="wd-user-img-square-neck">testshahhahahhahaha</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 文章/问答推荐 -->
      <div class="wd-sidebar-ctn">
        <h3 class="wd-sidebar-ctn-title">文章/问答推荐</h3>
        <div class="wd-sidebar-recommend-list">
          <ul>
            <li v-for="n in 10" :key="n">
              <a href="javascript:void 0">
                <p class="wd-sidebar-recommend-cover">
                <!-- 内容封面 -->
                    <img src="@/assets/images/default-avator.png" alt />
                </p>
                <div class="wd-sidebar-recommend-ctn">
                  <!-- 内容标题 -->
                  <p class="wd-sidebar-recommend-ctn-title">o(=•ェ•=)m</p>
                  <!-- 内容简介 -->
                  <p class="wd-sidebar-recommend-ctn-introduce">我是一头小毛驴，快来骑我呀~~~</p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </SidebarComponent>
    </div>
</template>
<script lang="ts" src="./_id.ts"></script>
<style lang="scss" scoped src="./_id.scss"></style>