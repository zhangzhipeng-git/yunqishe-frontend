/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\core\consts.ts
 * Created Date: Sunday, March 29th 2020, 6:52:27 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: core模块-全局静态常量
 * Last Modified: Wednesday July 8th 2020 10:42:06 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

/** 静态常量 */
const consts = {
  /** 第三方css */
  CSS_MAPS: {
    live2d: {
      id: 'zx-live2d',
      href: 'http://qny1.sharesource.top/live2d.css'
    },
    swiper: {
      id: 'swiper',
      href: 'https://cdn.bootcdn.net/ajax/libs/Swiper/5.4.5/css/swiper.min.css'
    }
  },
  /** 第三方js */
  JS_MAPS: {
    live2d: {
      id: 'zx-live2d',
      src: 'http://qny1.sharesource.top/live2d.min.js'
    },
    swiper: {
      id: 'swiper',
      src: 'https://cdn.bootcdn.net/ajax/libs/Swiper/5.4.5/js/swiper.min.js'
    },
    echarts: {
      id: "zx-echarts",
      src: "https://cdn.bootcss.com/echarts/4.7.0/echarts.common.min.js"
    },
    amap: {
      id: "zx-amap",
      src: "https://webapi.amap.com/maps?v=1.4.15&key=3157520ad22cc8d71fe23e13732729a9"
    },
    emoji: {
      id: "zx-emoji",
      src: "https://twemoji.maxcdn.com/v/12.1.5/twemoji.min.js",
      integrity:
        "sha384-E4PZh8MWwKQ2W7ANni7xwx6TTuPWtd3F8mDRnaMvJssp5j+gxvP2fTsk1GnFg2gG",
      crossorigin: "anonymous"
    },
    hljs: {
      id: "zx-hljs",
      src: "https://cdn.bootcss.com/highlight.js/9.18.1/highlight.min.js"
    },
    cryptojs: {
      id: "zx-cryptojs",
      src: "https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"
    },
    jsencrypt: {
      id: "zx-jsencrypt",
      src: "https://cdn.bootcdn.net/ajax/libs/jsencrypt/3.0.0-beta.1/jsencrypt.min.js"
    }
  },
  /** 图片base64占位符 */
  ERROR_IMG: "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMdaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVDREFCM0FFMENBOTExRTdBRTI2QUJDMTVERTUwNEU0IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVDREFCM0FEMENBOTExRTdBRTI2QUJDMTVERTUwNEU0IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iM0M3QUFEQTBBNUI2OUNFNkVFODVBQ0VDMEU2MzRCOEYiIHN0UmVmOmRvY3VtZW50SUQ9IjNDN0FBREEwQTVCNjlDRTZFRTg1QUNFQzBFNjM0QjhGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUF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",
  // https://github.com/leizongmin/js-xss/blob/master/README.zh.md
  JSXSS_OPTIONS: {
    css: false // 不对style作限制
  },
  /** live2d模型配置文件urls index：0-旺财，1-雷姆，2-伊斯特瓦尔*/
  live2dModels: [{
    name: '旺财',
    url: '/live2d/model/wanko/wanko.model.json',
    eventObjUrl: '/live2d/message.wanko.json'
  }, {
    name: '雷姆',
    url: '/live2d/model/rem/rem.json',
    eventObjUrl: '/live2d/message.rem.json'
  }, {
    name: '伊斯特瓦尔',
    url: '/live2d/model/histoire/model.json',
    eventObjUrl: '/live2d/message.histoire.json'
  }],
  /** 默认live2d模型为旺财 */
  live2dActiveIndex: 0,
  /** 机器人 */
  robot: {
    active: 'sizhi',
    /** 思知机器人api */
    'sizhi': {
      api: 'https://api.ownthink.com/bot?appid=4a1e3e7fe3da05a0a8a3673a7cabf00f&userid=zaAGVc5A&spoken=',
      success: {
        key: 'message',
        value: 'success'
      },
      isText: {
        key: 'data.type',
        value: 5000
      },
      reply: {
        key: 'data.info.text'
      }
    }
  },
  /** 默认接口请求渠道 */
  defaultChannel: '/f'
};


export default consts;