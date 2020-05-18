<template>
  <figure ref="figure">
    <div class="wd-video-player">
      <video
        ref="video"
        :src="src"
        :poster="poster"
        :loop="loop"
        :autoplay="options$.autoplay"
        :preload="options$.preload"
        :controls="options$.controls"
        @loadedmetadata="loadedmetadata"
        @canplay="canplay"
        @progress="progress"
        @click="pause"
        @ended="paused = true"
        @timeupdate="timeupdate"
        webkit-playsinline
        playsinline
        x5-video-player-type="h5"
      >
        <template v-if="isSupport">
          <source type="video/mp4" />
          <source type="video/ogg" />
          <source type="video/webm" />
        </template>
        <template v-else>
          <span>{{ options$.notSupportedMessage }}</span>
        </template>
      </video>
      <!-- 有插槽时显示插槽阻断播放 -->
      <slot v-if="$slots.default"/>
      <!-- 可播放 -->
      <template v-else>
        <!-- 加载视频 -->
        <div v-if="!canplay$" class="loading">
          <div class="loading-icon">
            <i class="icommon icon-loading-wheel"></i>
          </div>
        </div>
        <!-- 未开始播放或当前暂停或已播放完 -->
        <div v-show="paused || isInAnimation" class="mask" @click="play">
          <div class="icon-wrap" :class="isInAnimation ? 'animation' : ''">
            <i class="icommon" :class="' icon-' + (paused? 'play' : 'pause')"></i>
          </div>
        </div>
        <div v-if="!options$.controls&&!isMB" class="tools">
          <!-- 进度 -->
          <div
            ref="bar"
            class="progress"
            @mouseenter="mouseenter"
            @mouseleave="mouseleave"
            @mousemove="mousemove($event)"
            @click="skip($event)"
            :style="{
          height: hover?'7PX':'5PX',
          'margin-top':hover?'-1PX':'0'
        }"
          >
            <!-- 鼠标悬浮显示当前时间 -->
            <span
              ref="hoverTip"
              :style="{left:hoverTipLeft}"
              v-show="hover"
              class="hover-time-tip"
            >{{hoverTimeStr}}</span>
            <!-- 总时长 -->
            <div class="outer-bar"></div>
            <!-- 已缓冲 -->
            <div
              class="buffer-bar"
              :style="{ width: ((bufferedLength/duration>1?1:bufferedLength/duration) * 100) + '%' }"
            ></div>
            <!-- 已播放 -->
            <div
              class="play-bar"
              :style="{ width: ((currentTime/duration>1?1:currentTime/duration) * 100) + '%' }"
            >
              <!-- 去播放位置的按钮 -->
              <div
                ref="barBtn"
                class="bar-btn"
                @mousedown="start1"
                @touchstart="start1"
                :style="{display:hover?'block':'none', left: btnLeft}"
              ></div>
            </div>
            <!-- 鼠标悬浮移动时间点提示 -->
            <div class="tip"></div>
          </div>
          <!-- controls -->
          <div class="controls">
            <div class="fl">
              <!-- 上一个 -->
              <div v-if="hasPre" class="box" @click="$emit('prev', $event)">
                <a href="javascript:void 0">
                  <i class="icommon icon-arrow-left-circle"></i>
                  <span></span>
                </a>
              </div>
              <!-- 播放/暂停 -->
              <div class="box play-pause" @click="switch$">
                <a href="javascript:void 0">
                  <i
                    class="icommon"
                    :class="
                  ' icon-' + (paused? 'play' : 'pause') + '-circle'
                "
                  ></i>
                  <span></span>
                </a>
              </div>
              <!-- 下一个 -->
              <div v-if="hasNex" class="box" @click="$emit('next', $event)">
                <a href="javascript:void 0">
                  <i class="icommon icon-arrow-right-circle"></i>
                  <span></span>
                </a>
              </div>
              <div class="box ctime-dtime">
                <i>{{ currentTimeStr }}/{{ durationStr }}</i>
              </div>
            </div>
            <div class="fr">
              <!-- 循环播放 -->
              <div class="box" @click="replay">
                <a href="javascript:void 0" class="replay">
                  <i class="icommon icon-rotate-cw"></i>
                  <span></span>
                </a>
              </div>
              <!-- 声音 -->
              <div
                class="box volume"
                @mouseover="showVolumeBar=true"
                @mouseout="showVolumeBar=false"
                @click="switchVolume"
              >
                <a href="javascript:void 0">
                  <i
                    class="icommon"
                    :class="'icon-volume-'+(this.volume===0?'x':this.volume<.5?'1':'2')"
                  ></i>
                  <span></span>
                </a>
                <!-- 阻止冒泡 -->
                <div class="volume-back" v-show="showVolumeBar" @click.stop>
                  <div class="volume-wrap" @click="changeVolume" v-show="true" ref="vbar">
                    <div class="volume-bar" :style="{height: ((volume)*100)+'%'}">
                      <div
                        class="volume-bar-btn"
                        @mousedown="start2"
                        @touchstart="start2"
                        ref="vbarBtn"
                        :style="{bottom: vbarBtnBottom}"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 全屏 -->
              <div v-if="isSupportFullScreen" class="box" @click="fullScreen">
                <a href="javascript:void 0">
                  <i class="icommon" :class="'icon-'+(full?'minimize':'maximize')"></i>
                  <span></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </figure>
</template>
<script lang="ts" src="./video.ts"></script>
