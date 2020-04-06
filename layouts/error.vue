<template>
  <div class="wd-error">
    <!-- 遮罩 -->
    <div class="wd-error-mask"></div>
    <!-- error 详情 -->
    <div class="wd-error-detail">
      <!-- 旋转头像 -->
      <div class="wd-error-detail-avator">
        <a href="javascript: void 0">
          <img src="@/assets/images/error-avator.jpg" alt="Error Logo" />
        </a>
        <h1>{{status}}</h1>
      </div>
      <!-- 提示 -->
      <div class="wd-error-detail-tip">
        <hr />
        <p>{{message}}，≧ ﹏ ≦</p>
        <hr />
        <p>欢迎来到的我的小窝，^_^</p>
      </div>
      <!-- 返回首页 -->
      <div class="wd-error-gohome">
        <button @click="$router.push('/')">返回首页</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
@Component({layout: 'default'})
export default class ErrorComponent extends Vue {
  @Prop({ type: Object, default: null })
  error!: object;

  get status() {
    return (this.error && (<any>this.error).statusCode) || 500;
  }

  get message() {
      return '对不起，' + (this.status === 404?'您要找的页面被我弄丢了' : '小站弟弟生病了');
  }

  constructor() {
    super();
  }
}
</script>
<style lang="scss" scoped>
.wd-error {
  position: fixed;
  z-index:9999999999;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  font-family: "ff-tisa-web-pro-1", "ff-tisa-web-pro-2", "Lucida Grande",
    "Hiragino Sans GB", "Hiragino Sans GB W3", "Microsoft YaHei",
    "WenQuanYi Micro Hei", sans-serif;
  background: url("../assets/images/background/error-bg.jpg") left top no-repeat;
  background-size: cover;
}
.wd-error-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  height: 100%;
  width: 100%;
  opacity: 0.7;
  background-image: linear-gradient(
    to left top,
    black 30%,
    rgb(56, 53, 53) 70%
  );
}
.wd-error-detail {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
}
.wd-error-detail-avator {
  a {
    display: inline-block;
    border: 2px solid white;
    border-radius: 50%;
    transition: all 0.5s;
    &:hover {
      transform: rotate(360deg);
      border-color: skyblue;
    }

    img {
      width: 7rem;
      height: 7rem;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  h1 {
    font-weight: lighter;
  }
}
.wd-error-detail-tip {
  font-size: $font-size-small;
  hr {
    margin: 1.5rem auto;
    opacity: 0.5;
    border-top: 1px solid white;
    &:first-child {
      width: 50%;
      margin-top: 2rem;
    }
    &:nth-child(3) {
      width: 15%;
    }
  }
  p {
    width: 30rem;
    margin: 0 auto;
  }
}
.wd-error-gohome {
  margin-top: 2rem;
  button {
    display: inline-block;
    width: 6rem;
    font-size:$font-size-normal;
    line-height: 3rem;
    color: white;
    border: 1px solid white;
    border-radius: 3rem;
    background-color: transparent;
    &:hover {
      color: black;
      border-color: black;
      background-color: white;
    }
  }
}
</style>