<template>
  <div id="id-ui-media-detail">
    <!-- 头部媒体 -->
    <div class="ui-media-header">
      <mediaComponent :src="src" @firstPlay="firstPlay($event)">
        <template v-if="privilege.type">
          <div class="ui-privilege">
            <div class="ui-privilege-wrap">
              <p class="ui-privilege-tip">{{privilege.tip}}</p>
              <p class="ui-privilege-btn">
                <button @click="doAction">{{privilege.text}}</button>
              </p>
            </div>
          </div>
        </template>
      </mediaComponent>
      <div class="ui-user">
        <div class="fl">
          <div class="ui-user-avator">
            <img :src="user.avator" alt="用户头像" />
          </div>
          <div class="ui-user-info">
            <p class="ui-user-name-level">
              <span class="wd-user-nickname">{{ user.nickname }}</span>
              <span class="wd-user-level">Lv.{{ user.level }}</span>
            </p>
            <p class="ui-user-create-time">发表于{{ mediaClass.createTime }}</p>
          </div>
        </div>
        <div class="fr">
          <button>+&nbsp;关注</button>
        </div>
      </div>
      <!-- 播放列表 -->
      <div class="ui-play-list" v-if="mediaContents.length > 1">
        <h3>播放列表</h3>
        <ul>
          <li @click="goPlay(v, i)" v-for="(v, i) in mediaContents" :key="i">
            <a :class="{ active: activeIndex === i }" href="javascript: void 0">第{{ i + 1 }}集</a>
          </li>
        </ul>
      </div>
    </div>
    <!-- 评论 -->
    <!-- 支付云币 -->
    <PopComponent
      v-if="privilege.type === 2 || privilege.type === 5"
      ref="pop_for_charge"
      class="wd-charge-strategy"
    >
      <p class="wd-fs-min">
        您正在获取
        <span class="wd-remind">付费内容</span>
      </p>
      <!-- 非会员全价 -->
      <template v-if="privilege.type === 2">
        <p class>
          本次需支付
          <span class="wd-remind">{{select.price}}</span>云币
        </p>
        <p class="wd-fs-min">
          <a class="wd-link" @click="alertOpenVip">开通会员</a>立刻可以享受更多优惠
        </p>
      </template>
      <!-- 会员优惠价 -->
      <template v-else>
        <p class>
          本次需支付
          <span class="wd-old-price">({{select.price}})</span>
          <span class="wd-remind">{{select.price*(select.discount?select.discount:.5)}}</span>云币
        </p>
        <p class="wd-fs-min">
          已享受会员
          <span class="wd-remind">{{select.discount?select.discount+'折':'半价'}}</span>优惠
        </p>
      </template>
      <button @click="payYB">支付云币</button>
    </PopComponent>
    <!-- 开通会员 -->
    <PopComponent
      v-if="privilege.type !== 1 && privilege.type !== 5"
      ref="pop_for_open"
      class="wd-charge-strategy"
    >
      <div class="wd-vip-list">
        <ul>
          <li v-for="(v, i) in vipArgs" :key="i" @click="chooseDuration(v,i)">
            <a href="javascript: void 0" :class="{active: timeType === i}">
              <span class="wd-remind">VIP</span>
              {{v.duration}}个月
              <br />
              <span>{{payType===0?v.coin+'云币':v.money+'元'}}</span>
            </a>
          </li>
        </ul>
        <div class="wd-charge-type">
          <a href="javascript:void 0" v-for="(v,i) in [{icon:'bitcoin',text:'云币'},{icon:'alipay',text:'支付宝'},{icon:'wechat-pay',text:'微信'}]" :key=i @click="choosePayType(v,i)" :class="{active: payType===i}">
              <i class="icommon" :class="'icon-'+v.icon"></i>{{v.text}}
          </a>
        </div>
        <button @click="openVip">开通会员</button>
      </div>
    </PopComponent>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
