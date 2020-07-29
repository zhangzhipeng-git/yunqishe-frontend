/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\pages\circle\index.scss
 * Created Date: Sunday, December 15th 2019, 10:41:15 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 圈子首页
 * Last Modified: Sunday July 19th 2020 3:10:06 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

import Component from "vue-class-component";
import strCut from "~/core/modules/filters/strCut";
import BaseComponent from "~/core/base-component";
import TopicContentService from '../../service/topic-content/index';
import TopicClassService from '../../service/topic-class/index';
import { Context } from "@nuxt/types";
import BannerDisposeService from '../../service/banner-dispose/index';
import CarouselComponent from '../../core/modules/components/commons/carousel/carousel';

/**
 * 处理话题分类
 * @param data 响应数据
 */
function handleTopicClass(data: any) {
  const topicClasses = data.topicClasses;
  if (!topicClasses) { return []; }
  // 区分大众话题和系统原创话题
  const blocks$ = [
    { name: "大众话题", plates: [] },
    { name: "系统话题", plates: [] }
  ];
  topicClasses.forEach((topic: any) => {
    if (topic.uid === 1) {
      blocks$[0].plates.push(<never>topic);
    } else {
      blocks$[1].plates.push(<never>topic);
    }
  });
  return blocks$;
}
/**
 * 处理话题内容列表(置顶+最新+精华+人气+随机)
 * @param data 响应数据
 */
function handleTopicContent(data: any) {
  const tabs = data;
  if (!tabs) { return {}; }
  return tabs;
}

/**
 * 处理轮播配置
 * @param data 响应数据
 */
function handleImgList(data: any) {
  const bannerDisposes = data.bannerDisposes;
  if (!bannerDisposes) { return []; }
  return bannerDisposes;
}

@Component({
  layout: "app",
  filters: {
    strCut
  },
  components: {CarouselComponent},
  async asyncData(context: Context) {
    if (CircleComponent.activated) return;
    const app = BaseComponent.getSingleton();
    app.handler.load();
    let imgList: any = [], data: any = {}, blocks: any[] = [];
    await Promise.all([
      app.httpRequest(BannerDisposeService.selectList({type: 2}, '/f'), {context}),
      app.httpRequest(TopicClassService.selectList({ type: 0 }, '/f'), {context}),
      app.httpRequest(TopicContentService.selectTabList({ pageNum: 1, pageSize: 5, type: 0}, '/f'), {context})
    ]).then((datas: any) => {
      const data0 = datas[0];
      const data1 = datas[1];
      const data2 = datas[2];
      imgList = handleImgList(data0);
      blocks = handleTopicClass(data1);
      data = handleTopicContent(data2);
    });
    return { imgList, blocks, data }
  }
})
export default class CircleComponent extends BaseComponent {

  /** 轮播右侧列表 */
  tabList: any[] = [
    {key: 'tops', text: '置顶'},
    {key: 'news', text: '最新'},
    {key: 'creams', text: '精华'},
    {key: 'populars', text: '人气'},
    {key: 'randoms', text: '随机'}
  ];
  /** 默认第一个选中,置顶tap */
  activeKey = 'tops';
  /** 序号颜色 */
  listColors: any[] = [
    "#ee1d24",
    "#ef6ea8",
    "#88d331",
    "#ffa500",
    "#808080"
  ];
  constructor() {
    super();
  }
  activated() {
    CircleComponent.activated = true;
  }
  destoryed() {
    CircleComponent.activated = false;
  }

  vote(img: any) {

  }
}
