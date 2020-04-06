/*
 * Filename: d:\frontend\vue\nuxt-ssr\pages\forum\forum.ts
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Saturday, December 7th 2019, 1:21:06 pm
 * Author: zzp-dog
 * 论坛首页
 * Copyright (c) 2019 Your Company
 */

import Component from "vue-class-component";
import strCut from "~/core/modules/filters/strCut";
import BaseComponent from "~/core/base-component";

@Component({
  layout: "app",
  filters: {
    strCut
  }
})
export default class ForumComponent extends BaseComponent {
  /** 近期推荐 */
  tabInvitations = [];
  /** 分类版块 */
  blocks: any[] = [];
  /** 悬浮标识 */
  hoverID: string = "";
  /** 序号颜色 */
  listColors: any[] = [
    "#ee1d24",
    "#ef6ea8",
    "rgb(109, 238, 29)", // 你是个鹤立鸡群的家伙
    "#ffa500",
    "gray"
  ];

  constructor() {
    super();
  }

  async activated() {
    this.handler.load();
    // 查近期的帖子
    await this.getTabInvitations();
    // 查版块并分类
    await this.getBlocks();
    this.handler.unload();
  }

  /**
   * 获取tab中显示的帖子
   */
  getTabInvitations() {
    return this.httpRequest(
      this.http.get("/topicContent/f/select/list?pageNum=1&pageSize=5&wt=0&type=2"),
      {
        success: (data: any) => {
          this.tabInvitations = data.topicContents;
        }
      }
    );
  }

  /**
   * 获取版块
   */
  getBlocks() {
    return this.httpRequest(this.http.get("/topic/f/select/list"), {
      success: (data: any) => {
        const topics = data.topics;
        // 区分大众版块和系统原创版块
        const blocks = [
          { name: "大众版块", plates: [] },
          { name: "系统原创", plates: [] }
        ];
        topics.forEach((topic: any) => {
          if (topic.uid === 1) {
            blocks[0].plates.push(<never>topic);
          } else {
            blocks[1].plates.push(<never>topic);
          }
        });
        this.blocks = blocks;
      }
    });
  }

  /**
   * 去相关的版块
   * @param item 版块
   */
  toContent(item: any) {
    this.httpRequest(this.http.get('/topic/f/select/one?id='+item.id), {
      success: (data: any) => {
        this.$router.push('/forum/content');
        this.localStorage.setItem('block', data.topic);
      }
    });
  }

  /**
   * 鼠标悬浮时出现边框
   * @param ID 版块标识 如"1-12"
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

  /**
   * 去某个话题内容（帖子）
   * 1.查所属话题（版块）信息
   * 2.将查到的话题（版块）本地持久化
   * @param v 话题内容（帖子）
   */
  toInvitation(v: any) {
    const tid = v.tid;
    this.httpRequest(this.http.get('/topic/f/select/one?id='+tid), {
      success: (data: any) => {
        this.localStorage.setItem('block', data.topic);
        this.$router.push('/forum/detail?id='+v.id);
      }
    });
  }
}
