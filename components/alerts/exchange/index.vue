<template>
    <!-- 兑换云币开始(privilege为2，3，4，5时都会用到，其中2和5是要支付云币，3和4是要开通会员[可以使用云币开通]) -->
    <PopComponent ref="pop_for_exchange" class="wd-pay">
      <ul class="wd-exchange-list">
        <li v-for="(v, i) in exchangeArgs" :key="i" @click="exchangeArg=v">
          <a href="javascript: void 0" :class="{active: exchangeArg === v}">
            <i class="icomoon icon-bitcoin"></i>&nbsp;{{v.coin}}
            <br />
            <span>{{v.price+'元'}}</span>
          </a>
        </li>
      </ul>
      <!-- 兑换方式（1-支付宝，2-微信） -->
      <div class="wd-exchange-type">
        <a
          href="javascript:void 0"
          v-for="(v,i) in [{icon:'alipay',text:'支付宝'},{icon:'wechat-pay',text:'微信'}]"
          :key="i"
          @click="exchangePayType=i"
          :class="{active: exchangePayType===i}"
        >
          <i class="icomoon" :class="'icon-'+v.icon"></i>
          {{v.text}}
        </a>
      </div>
      <button @click="exchangeYB($event)">兑换云币</button>
    </PopComponent>
</template>
<script lang="ts" src="./index.ts"></script>