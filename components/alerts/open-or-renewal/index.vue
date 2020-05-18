<template>
    <!-- 开通会员开始 -->
    <PopComponent ref="pop_for_vip" class="wd-pay">
      <ul class="wd-open-renewal-list">
        <li v-for="(v, i) in vipArgs" :key="i" @click="vipArg=v">
          <a href="javascript: void 0" :class="{active: vipArg === v}">
            <span class="wd-remind">VIP</span>
            {{v.duration}}个月
            <br />
            <span>{{vipPayType===0?v.coin+'云币':v.price+'元'}}</span>
          </a>
        </li>
      </ul>
      <!-- 开通方式（1-云币，2-支付宝，3-微信） -->
      <div class="wd-open-renewal-type">
        <a
          href="javascript:void 0"
          v-for="(v,i) in [{icon:'bitcoin',text:'云币'},{icon:'alipay',text:'支付宝'},{icon:'wechat-pay',text:'微信'}]"
          :key="i"
          @click="vipPayType = i"
          :class="{active: vipPayType===i}"
        >
          <i class="icommon" :class="'icon-'+v.icon"></i>
          {{v.text}}
        </a>
      </div>
      <button @click="openOrRenewalVIP($event)">开通会员</button>
    </PopComponent>
</template>
<script lang="ts" src="./index.ts"></script>