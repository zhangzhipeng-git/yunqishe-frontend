/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\pages\circle\content\index.ts
 * Created Date: Sunday, December 15th 2019, 10:41:15 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 某个话题下的话题内容列表页
 * Last Modified: Sunday July 19th 2020 7:05:51 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

import Component from "vue-class-component";
import BaseComponent from "~/core/base-component";
import { Throttle } from '../../../core/modules/annotations/index';
import { Context } from "@nuxt/types";

import NoResultComponent from '../../../core/modules/components/commons/no-result/no-result';
import PartLoadingComponent from '../../../core/modules/components/commons/part-loading/part-loading';

import ConcernService from '../../../service/concern/index';
import TopicClassService from '../../../service/topic-class/index';
import TopicContentService from '../../../service/topic-content/index';

const options: any = {
  layout: "app",
  components: {
    NoResultComponent,
    PartLoadingComponent
  },
  async asyncData(context: Context) {
    let topic: any = {},pageNum: number = 1,topicContents: any[] = [],isMoreTopicContent: boolean = false;
    const app = BaseComponent.getSingleton();
    const id = parseInt(<string>context.route.query.id, 10);
    app.handler.load();
    await Promise.all([
      app.httpRequest(TopicClassService.selectOne({ id }, '/f'), {context}),
      app.httpRequest(TopicContentService.selectList({ pid: id, type1: 0, pageNum, pageSize: 10 }, '/f'), {context})
    ]).then((datas: any) => {
      const data0 = datas[0];
      const data1 = datas[1];
      const topicClass = data0.topicClass;
      const topicContents$ = data1.topicContents;
      if (!!topicClass) {topic = topicClass;}
      if (!!topicContents$) {
        topicContents = topicContents$;
        isMoreTopicContent = topicContents.length === 10;
      }
    });
    const o = {topic,topicContents,isMoreTopicContent};
    app.setAsyncData(o);
    return o;
  }
};
@Component(options)
export default class IndexComponent extends BaseComponent {
  /** 所属话题 */
  topic: any = {};
  /** 筛选列表 */
  filters: any[] = [
    '全部',
    '最新',
    '精华',
    '人气'
  ];
  /** 1-全部，2-最新，3-精华，4-人气 5-随机*/
  searchFilter: number = 1;
  /** 当前页 */
  pageNum: number = 1;
  /** 每页大小 */
  pageSize: number = 10;
  /** 话题内容 */
  topicContents: any[] = [];
  /** 没有更多 */
  isMoreTopicContent: boolean = false;
  /** 列表筛选是否加载中，默认false-不在加载中 */
  isLoading: boolean = false;
  /** 是否列表为空 */
  get isBlank() {
    return !this.topicContents || this.topicContents.length === 0;
  }

  constructor() {
    super();
  }

  /**
   * 路由激活钩子
   */
  activated(): void {
    this.getAsyncDataToThisInActivated();
  }

  /**
   * 获取圈子话题内容列表
   * @param isAppend 是否查看更多
   */
  getPagingList(isAppend: boolean = false) {
    this.httpRequest(TopicContentService.selectList({ type2: this.searchFilter, pid: this.topic.id, pageNum: this.pageNum, pageSize: this.pageSize }, '/f'), {
      success: (data: any) => {
        const topicContents = data.topicContents;
        this.isMoreTopicContent = topicContents.length === this.pageSize;
        if (!isAppend) {
          this.topicContents = topicContents;
          this.isLoading = false;
          return;
        }
        this.topicContents = this.topicContents.concat(topicContents);
        this.handler.unload();
      }
    });
  }

  /**
   * 筛选
   * @param type 1-全站，2-最新，3-精华，4-人气，5-随机
   */
  filter(type: number) {
    this.pageNum = 1;
    this.searchFilter = type;
    this.isLoading = true;
    this.getPagingList();
  }

  /**
   * 查看更多
   */
  seeMore() {
    if (!this.isMoreTopicContent) return;
    this.pageNum++;
    this.handler.load();
    this.getPagingList(true);
  }

  /**
   * 获取关注
   */
  get getConcern() {
    if (!this.topic.concernInfo) {
      this.$set(this.topic, 'concernInfo', { concern: 0 });
    }
    return this.topic.concernInfo.concern;
  }

  /**
   * 关注/取消关注话题
   */
  @Throttle(3000, (o: IndexComponent) => {
    o.handler.toast({ text: '请不要频繁操作~' });
  })
  concernTopic() {
    if (!this.curUser) {
      this.handler.toast({ text: '请先登录~' });
      return;
    }
    const concern = this.getConcern === 0 ? 1 : 0;
    const obj = {
      type: 2,
      concern,
      oid: this.topic.id,
      uid: this.curUser.id
    }
    const isConcern = concern === 1;
    const v = this.topic;
    this.httpRequest(ConcernService.insertOrUpdate(obj, '/f'), {
      success: () => {
        this.handler.toast({ text: (isConcern ? '' : '取消') + '关注成功~' });
        if (!isConcern) { // 取消关注
          v.concernCount--;
          v.concernInfo.concern = 0;
        } else { // 关注
          v.concernCount++;
          v.concernInfo.concern = 1;
        }
      }
    });
  }
}
