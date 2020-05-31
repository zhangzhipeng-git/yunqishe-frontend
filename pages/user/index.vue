<template>
  <!-- user cover -->
  <div id="id-user">
    <!-- 滤镜 -->
    <div class="user-mask"></div>
    <!-- 用户详情 -->
    <div class="user-detail" ref="user_detail">
      <!-- 用户头像基本信息 -->
      <div class="user-info" ref="user_info">
        <a
          @click="
            $refs.bg_audio.paused
              ? $refs.bg_audio.play()
              : $refs.bg_audio.pause()
          "
          href="javascript:void 0"
          class="user-avator"
        >
          <img :src="user.avator" alt="用户头像" />
        </a>
        <!-- 背景音乐 -->
        <audio autoplay preload="auto" loop ref="bg_audio">
          <source :src="user.bgUrl" />
        </audio>
        <!-- 昵称和等级 -->
        <p>
          <span class="user-nickname">{{ user.nickname }}</span>
          <span
            class="user-sex icomoon"
            :class="
              'icon-' +
                (user.sex === 2
                  ? 'venus'
                  : user.sex === 1
                  ? 'mars'
                  : 'intersex')
            "
          ></span>
          <span class="wd-user-level user-level">lv.{{ user.level }}</span>
        </p>
        <!-- 专属称号 -->
        <!-- 备注：经验转化位等级，等级转化位段位！！！ -->
        <p>
          <!-- 角色 -->
          <template v-if="user.roleNames">
            <span
              class="user-label wd-user-role"
              v-for="(v1, i1) in user.roleNames"
              :key="'i1'+i1"
            >{{ v1 }}</span>
          </template>
          <!-- 标签 -->
          <span
            class="user-label wd-user-description"
            v-for="(v2, i2) in tags"
            :key="'i2'+i2"
          >{{ v2.name }}</span>
          <!-- 段位 -->
          <span class="user-label wd-user-designation">{{ user.dan }}</span>
        </p>
        <!-- 留言 -->
        <p class="user-say">这个人很懒什么也没说~</p>
      </div>
      <!-- 用户冬态开始 -->
      <div class="user-actions">
        <!-- 导航栏开始 -->
        <div class="user-action-nav" ref="user_bar">
          <ul>
            <li v-for="(v3, i3) in dynamicList" :key="'i3'+i3">
              <a
                @click="getDynamicData(i3, v3)"
                :class="{ active: activeIndex === i3 }"
                href="javascript: void 0"
              >{{ v3 }}</a>
            </li>
          </ul>
        </div>
        <!-- 导航栏结束 -->
        <!-- 主体内容开始 -->
        <div class="user-detail-main">
          <!-- 左侧内容开始 -->
          <SidebarComponent class="user-main-left">
            <div class="user-evaluate">
              <ul>
                <li
                  v-for="(v5, i5) in [
                    { k: '关注', v: concernCount },
                    { k: '粉丝', v: fansCount },
                    { k: '动态', v: dynamicCount },
                    { k: '魅力', v: charmValue }
                  ]"
                  :key="'i5'+i5"
                >
                  <div class="user-evaluate-k">{{ v5.k }}</div>
                  <div class="user-evaluate-v">{{ v5.v }}</div>
                </li>
              </ul>
            </div>
            <div class="user-introduce">
              <h3 class="wd-sidebar-ctn-title">个人简介</h3>
              <ul>
                <li
                  v-for="(v6, i6) in [
                    { k: 'ID', v: user.id },
                    { k: '昵称', v: user.nickname },
                    {
                      k: '性别',
                      v: user.sex === 1 ? '男' : user.sex === 2 ? '女' : '保密'
                    },
                    { k: '位置', v: user.address }
                  ]"
                  :key="'i6'+i6"
                >
                  <label class="user-introduce-k">{{ v6.k }}</label>
                  <span class="user-introduce-v">{{ v6.v }}</span>
                </li>
              </ul>
            </div>
            <!-- 用户收到的礼物 -->
            <div class="user-gifts">
              <h3 class="wd-sidebar-ctn-title">收到礼物</h3>
              <div class="item-mask"></div>
              <ul>
                <li v-for="(v7, i7) in giftRecords" :title="v7.gift.description" :key="'i7'+i7">
                  <a class="user-collect">
                    <img :src="v7.gift.url" :alt="v7.gift.name" />
                    <label for>{{ v7.gift.name }}</label>
                    <span>X{{ v7.groupCount }}</span>
                  </a>
                </li>
              </ul>
            </div>
            <!-- 用户捕获的奇妙动物 -->
            <div class="user-captures">
              <h3 class="wd-sidebar-ctn-title">精灵仓库</h3>
              <div class="item-mask"></div>
              <ul>
                <li v-for="i8 in 10" :key="'i8'+i8">
                  <a class="user-capture">{{ i8 }}</a>
                </li>
              </ul>
            </div>
            <!-- 最近访客 -->
            <div class="user-visitors">
              <h3 class="wd-sidebar-ctn-title">最近访客</h3>
              <div class="item-mask"></div>
              <ul>
                <li v-for="i9 in 10" :key="'i9'+i9">
                  <a class="user-visitor">{{ i9 }}</a>
                </li>
              </ul>
            </div>
          </SidebarComponent>
          <!-- 左侧内容结束 -->
          <!-- 右侧内容开始 -->
          <div class="user-main-right" ref="main_right">
            <!-- 内容列表开始 -->
            <template v-if="type < 7">
              <PartLoadingComponent class="ui-part-loading-list" v-if="isLoading" :type="1" />
              <NoResultComponent class="ui-no-data" v-else-if="hasQuery&&!isLoading&&!list.length" />
              <ul>
                <li v-for="(v4, i4) in list" :key="'i4'+i4">
                  <div class="ui-dynamic-content">
                    <!-- 头部信息开始 -->
                    <div class="ui-dynamic-content-head">
                      <!-- 用户头像开始 -->
                      <div class="ui-user-avator">
                        <img :src="user.avator" alt="用户头像" />
                      </div>
                      <!-- 用户头像结束 -->
                      <!-- 用户信息和发表信息开始 -->
                      <div class="ui-top-info">
                        <p>
                          {{user.nickname}}
                          <span class="wd-user-level">lv.{{user.level}}</span>
                        </p>
                        <p>
                          来自{{v4.device===1?'PC端':'移动端'}}
                          <i
                            class="icommon"
                            :class="'icon-'+(v4.device===1?'monitor' : 'tablet')"
                          ></i>
                        </p>
                      </div>
                      <!-- 用户信息和发表信息结束 -->
                    </div>
                    <!-- 头部信息结束 -->
                    <!-- 动态简介开始 -->
                    <div
                      class="ui-dynamic-content-body"
                      @click="toDynamicDetail(v4)"
                      v-if="v4.privilegeType === 0"
                    >
                      <!-- 标题开始 -->
                      <h3>{{v4.title}}</h3>
                      <!-- 标题结束 -->
                      <!-- 封面（有则显示）和简介开始 -->
                      <div class="ui-body-info-main">
                        <div class="ui-dynamic-cover" v-if="v4.cover">
                          <img :src="v4.cover" alt="内容封面" />
                        </div>
                        <p class="ui-dynamic-introduce">{{v4.introduce}}</p>
                      </div>
                      <!-- 封面（有则显示）和简介结束 -->
                    </div>
                    <!-- 动态简介结束 -->
                    <!-- 需要开通会员或付费后查看开始 -->
                    <div v-else-if="v4.privilegeType > 0">
                      <NoPrivilegeComponent :content="v4" :pay="$refs.pay" />
                    </div>
                    <!-- 需要开通会员或付费后查看结束 -->
                    <!-- 底部信息，收藏，点赞，观看，转发，评论开始 -->
                    <p class="ui-dynamic-content-foot">
                      <i class="icommon icon-star-o"></i>
                      {{v4.concernCount}}
                      <i class="icommon icon-thumbs-up-o"></i>
                      {{v4.thumbupCount}}
                      <i class="icommon icon-eye"></i>
                      {{v4.viewCount}}
                      <i class="icommon icon-external-link"></i>
                      {{v4.forwardCount}}
                      <i
                        class="icommon icon-message-square"
                      ></i>
                      {{v4.commentCount}}
                      <span
                        class="ui-dynamic-detail"
                        @click="toDynamicDetail(v4)"
                      >
                        <button>全文</button>
                      </span>
                    </p>
                    <!-- 底部信息，收藏，点赞，观看，转发，评论结束 -->
                  </div>
                </li>
              </ul>
              <!-- 查看更多 -->
              <p v-if="list.length" class="wd-view-more" @click="seeMore">{{!noMore?'查看更多':'暂无更多~'}}</p>
            </template>
            <!-- 内容列表结束 -->
            <!-- 资料设置开始 -->
            <template v-else-if="type === 7">
              <ul class="ui-user-info-set" formgroup ref="formGroup">
                <li class="ui-upload">
                  头像
                  <UploadComponent
                    class="ui-upload-component"
                    :multiply="false"
                    @onchange="onchange($event)"
                  >
                    <div class="ui-img-box">
                      <i class="icomoon icon-plus"></i>
                      <img :src="this.curUser.avator" alt=""/>
                    </div>
                  </UploadComponent>
                </li>
                <li>
                  <InputComponent
                    :label="'姓名'"
                    :pattern="'required'"
                    v-model="user$.name"
                  />
                </li>
                <li>
                  <InputComponent
                    :label="'昵称'"
                    :pattern="'required'"
                    v-model="user$.nickname"
                  />
                </li>
                <li>
                  <InputComponent
                    :label="'手机号'"
                    v-model="user$.phone"
                  />
                </li>
                <li>
                  <InputComponent
                    :label="'QQ'"
                    v-model="user$.qq"
                  />
                </li>
                <li>
                  <InputComponent
                    :label="'微信号'"
                    v-model="user$.wechat"
                  />
                </li>
                <li :style="{'padding-bottom':'.9rem'}">
                  <label for="userSex">性别</label>
                  <SelectComponent
                    :id="'userSex'"
                    :reverse="true"
                    :list="[{id: 0, description:'男'}, {id: 1, description: '女'}]"
                    v-model="user$.sexual"
                  />
                </li>
                <!-- CalendarComponent -->
                <li :style="{'padding-bottom':'.9rem'}">
                  <label for="birthday">生日</label>
                  <CalendarComponent
                    :id="'birthday'"
                    :reverse="true"
                    v-model="user$.birthday"
                  />
                </li>
                <!-- 个人说明 -->
                <li>
                  <InputComponent
                    :label="'个人说明'"
                    :multiple="true"
                    v-model="user$.say"
                  />
                </li>
                <li :style="{'text-align':'right'}">
                  <ButtonComponent :disabled="$refs.formGroup&&$refs.formGroup.invalid" @click="updateUser">保存</ButtonComponent>
                </li>
              </ul>
            </template>
            <!-- 资料设置结束-->
            <!-- 个性化开始 -->
            <template v-else>
              <ul>
                <li></li>
              </ul>
            </template>
            <!-- 个性化结束 -->
          </div>
          <!-- 右侧内容结束 -->
        </div>
        <!-- 主体内容结束 -->
      </div>
      <!-- 用户冬态结束 -->
    </div>
    <!-- 支付弹窗组件 -->
    <PayComponent ref="pay" />
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
