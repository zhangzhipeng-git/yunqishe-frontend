<template>
  <div class="wd-calendar-component">
    <div class="wd-date-input">
      <input @blur="blur" type="text" v-model="date$" /><i @click="toggle" class="icomoon icon-calendar"></i>
    </div>
    <div class="wd-date-pannel" v-show="show" :class="{'reverse': reverse}">
      <div class="wd-date-pannel-head">
        <span class="pre">
          <a href="javascript: void 0" @click="preYear"><i class="icomoon icon-chevrons-left"></i></a>
          <a href="javascript: void 0" @click="preMonth"><i class="icomoon icon-chevron-left"></i></a>
        </span>
        <span class="year-month">{{year}}&nbsp;年&nbsp;{{month}}&nbsp;月</span>
        <span class="nex">
          <a href="javascript: void 0" @click="nexMonth"><i class="icomoon icon-chevron-right"></i></a>
          <a href="javascript: void 0" @click="nexYear"><i class="icomoon icon-chevrons-right"></i></a>
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th v-for="(head, i) in heads" :key="i">{{head}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, i) in weeks" :key="i">
            <td v-for="(dayObj, j) in week" :key="j" :class="dayObj.month">
              <a v-if="dayObj.month==='thisMonth'" @click="selectDay(dayObj)" :class="{'active': Number(day) === dayObj.dayNum}" href="javascript: void 0">{{dayObj.dayNum}}</a>
              <template v-else>{{dayObj.dayNum}}</template>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="wd-date-pannel-foot">
        <button @click="close">关闭</button>
        <button @click="clear">清空</button>
        <button @click="now">现在</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./date.ts"></script>