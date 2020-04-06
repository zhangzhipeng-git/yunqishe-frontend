/*
 * Filename: d:\frontend\vue\nuxt-ssr\pages\forum\content\content.ts
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Saturday, December 7th 2019, 8:23:30 pm
 * Author: zzp-dog
 * 某版本的内容页
 * Copyright (c) 2019 Your Company
 */

import Component from "vue-class-component";
import BaseComponent from "~/core/base-component";
const options: any = {
  layout: "app"
};
@Component(options)
export default class IDComponent extends BaseComponent {
  /** 所属版块 */
  block: any = {};
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
  contents: any[] = [];
  /** 没有更多 */
  noMore: boolean = false;

  constructor() {
    super();
  }

  activated(): void {
    this.noMore = false;
    this.pageNum = 1;
    // 置空
    this.contents = [];
    this.block = this.localStorage.getItem('block');
    // 按过滤率类型查话题内容列表
    this.getPagingList()
  }

  /**
   * 获取论坛话题内容列表
   */
  getPagingList() {
    const queryStr = '&type=' + this.searchFilter + '&tid=' + this.block.id
    + '&pageNum=' + this.pageNum + '&pageSize=' + this.pageSize;
    this.httpRequest(this.http.get('/topicContent/f/select/list?wt=0' + queryStr), {
        success: (data: any) => {
            const contents = data.topicContents;
            if (!contents.length){
                this.noMore = true;
            } else {
                this.noMore = false;
            }
            this.contents = this.contents.concat(contents);
        }
    });
  }

  /**
   * 筛选
   * @param type 1-全站，2-最新，3-精华，4-人气，5-随机
   */
  filter(type: number) {
      this.pageNum = 1;
      this.pageSize = 10;
      this.searchFilter = type;
      this.getPagingList();
  }

  /**
   * 查看更多
   */
  seeMore() {
    if(this.noMore) return;
    this.pageNum++;
    this.getPagingList();
  }

  /**
   * 去帖子详情
   */
  toDetail(id: any) {
    this.$router.push({
        path: '/forum/detail',
        query: {
            id
        }
    });
  }

  /**
   * 获取关注
   */
  get getConcern() {
    if (!this.block.concernInfo) {
      this.$set(this.block, 'concernInfo', {concern: 0});
    } 
    return this.block.concernInfo.concern;
  }

  /**
   * 关注版块
   */
  concernBlock() {
    if(!this.curUser){
      this.handler.toast({text: '请先登录~'});
      return;
    }
    const concern = 
    this.getConcern === 0 ? 1 : 0;
    const obj = {
      wt: 0,
      type: 2,
      concern,
      oid: this.block.id,
      uid: this.curUser.id
    }
    const isConcern = concern === 1;
    const v = this.block;
    this.httpRequest(this.http.post('/concern/f/insertOrUpdate/one', obj, {throttle:3000}), {
      success: () => {
        this.handler.toast({text: (isConcern?'':'取消')+'关注成功~'});
        if (!isConcern) { // 取消关注
          v.concern--;
          v.concernInfo.concern = 0;
        } else { // 关注
          v.concern++;
          v.concernInfo.concern = 1;
        }
        this.localStorage.setItem('block', v);
      }
    });
  }

}
