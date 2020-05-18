<template>
  <!-- privilegeType为0和1时不显示,因为要调用本组件的函数，所以必须使用v-show，用v-if为false时是取不到本组件实例的！！！ -->
  <div v-show="privilegeType > 1">
    <!-- 支付云币开始 -->
    <PopComponent v-if="privilegeType === 2 || privilegeType === 5" ref="pop_for_charge">
      <p class="wd-fs-min">
        您正在获取
        <span class="wd-remind">付费内容</span>
      </p>
      <!-- 全价支付云币开始 -->
      <template v-if="privilegeType === 2">
        <p class>
          本次需支付
          <span class="wd-remind">{{content.price}}</span>云币
        </p>
        <p class="wd-fs-min">
          <a class="wd-link" @click="alertOpenVip">开通会员</a>立刻可以享受更多优惠
        </p>
      </template>
      <!-- 全价支付云币结束 -->
      <!-- 会员优惠价开始 -->
      <template v-else>
        <p class>
          本次需支付
          <span class="wd-old-price">({{content.price}})</span>
          <span class="wd-remind">{{content.price*(content.discount?content.discount:.5)}}</span>云币
        </p>
        <p class="wd-fs-min">
          已享受会员
          <span class="wd-remind">{{content.discount?content.discount+'折':'半价'}}</span>优惠
        </p>
      </template>
      <!-- 会员优惠价结束 -->
      <button @click="payYB">支付云币</button>
    </PopComponent>
    <!-- 支付云币开始结束 -->
    <!-- 开通会员开始 (privilegeType为2时提示开通会员后优惠)-->
    <OpenRenewalComponent v-if="privilegeType < 5" ref="pop_for_vip" @openOrRenewalVIP="openVIP($event)"/>
    <!-- 兑换云币开始(privilege为2，3，4，5时都会用到，其中2和5是要支付云币，3和4是要开通会员[可以使用云币开通]) -->
    <ExchangeComponent ref="pop_for_exchange" @exchangeYB="exchangeYB($event)"/>
    <!-- 兑换云币结束 -->
  </div>
</template>
<script lang="ts" src="./index.ts"></script>