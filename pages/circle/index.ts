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

@Component({
  layout: "app",
  filters: {
    strCut
  },
  async asyncData(context: Context){
    if (CircleComponent.activated) return;
    let tabTopicContents: any[] = [],
        blocks: any[] = [];
    const app = BaseComponent.getSingleton();
    app.handler.load();
    await Promise.all([
      app.httpRequest(TopicClassService.selectList({type: 0},'/f'), context),
      app.httpRequest(TopicContentService.selectList({pageNum:1,pageSize:5,type1:0,type2:2,isFree: true},'/f'), context)
    ]).then((datas: any) => {
      const data0 = datas[0];
      const data1 = datas[1];
      const topicClasses = data0.topicClasses;
      if (!!topicClasses) {
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
        blocks = blocks$;
      }
      const tabTopicContents$ = data1.topicContents;
      if (!!tabTopicContents$) {
        tabTopicContents = tabTopicContents$;
      }
    });
    return {
      blocks,
      tabTopicContents
    }
  }
})
export default class CircleComponent extends BaseComponent {
  /** 近期推荐 */
  tabTopicContents = [];
  /** 分类话题 */
  blocks: any[] = [];
  /** 悬浮标识 */
  hoverID: string = "";
  /** 序号颜色 */
  listColors: any[] = [
    "#ee1d24",
    "#ef6ea8",
    "rgb(109, 238, 29)",
    "#ffa500",
    "gray"
  ];

  constructor() {
    super();
  }

  activated() {
    CircleComponent.activated = true;
  }

  /**
   * 鼠标悬浮时出现边框
   * @param ID 话题标识 如"1-12"
   */
  showHoverStyle(ID: string): void {
    this.hoverID = ID;
  }

  /**
   * 鼠标离开，隐藏边框
   */
  hideHoverStyle(): void {
    this.hoverID = "";
  }
}
