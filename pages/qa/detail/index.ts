/*
* Filename: d:\frontend\vue\nuxt-ssr\pages\qa\detail\_id.ts
* Path: d:\frontend\vue\nuxt-ssr
* Created Date: Saturday, December 7th 2019, 8:23:56 pm
* Author: zzp-dog
* 话题内容详情
* Copyright (c) 2019 Your Company
*/

import Component from "vue-class-component";
import ReplyComponent from "@/core/modules/components/commons/reply/reply.vue";
import SidebarComponent from "@/core/modules/components/projections/sidebar/sidebar.vue";
import PageBarComponent from '@/core/modules/components/commons/page-bar/page-bar.vue';
import vip from '@/core/modules/filters/vip';
import strCut from '~/core/modules/filters/strCut';
import BaseComponent from "@/core/base-component.ts";
import { Ref } from "vue-property-decorator";
import DateUtil from "~/core/modules/util/date-util";
import { Throttle } from '../../../core/modules/annotations/index';
import { Context } from "@nuxt/types";

import UserService from '../../../service/user/index';
import TopicContentService from '../../../service/topic-content/index';
import TopicCommentService from '../../../service/topic-comment/index';
import TopicClassService from '~/service/topic-class';

const asyncData = async (context: Context) => {
  const app = BaseComponent.getSingleton();
  const query = <any>(context.route.query);
  const id = query.id;
  const pid = query.pid;
  let topic = {};
  let topicContent: any = {};
  let Lv1CommentsPageNum = 0;
  let Lv1Comments: any = [];
  let isMoreLv1Comment;
  let hasSideContent = !0;
  let activeUsers: any = [];
  let recommendTopicContents: any = [];
  app.handler.load();
  await Promise.all([
    // 根据pid查所属类别
    app.httpRequest(TopicClassService.selectOne({ id: pid }, '/f'), {context}),
    // 根据id查话题内容详情
    app.httpRequest(TopicContentService.selectOne({ id }, '/f'), {context})
  ]).then((datas: any) => {
    const data0: any = datas[0];
    const data1: any = datas[1];
    if (data0.topicClass) { topic = data0.topicClass; }
    if (data1.topicContent) {
      app.cleanVHtml(data1.topicContent.text);
      app.getUserLevel(data1.topicContent.user);
      topicContent = data1.topicContent;
    }
  });

  // 如果查到话题内容,则查询一级评论和其一页二级评论
  if (topicContent) {
    const tcid = (<any>topicContent).id;
    await app.httpRequest(TopicCommentService.selectList({ tcid, pid: -1, pageNum1: 1, pageSize1: 10, pageNum2: 1, pageSize2: 4 }, '/f'), {
      success: (data: any) => {
        /** 一级评论/回复 */
        Lv1Comments = data.topicComments;
        /** 一级评论/回复是否满一页 */
        isMoreLv1Comment = Lv1Comments.length === 10;
        // 计算父级回复者等级
        Lv1Comments.forEach((topReply: any) => {
          app.getUserLevel(topReply.user);
          // 计算二级回复回复者等级
          topReply.comments.forEach((comment: any) => {
            app.getUserLevel(comment.user);
          });
        });
      },
      context
    });
  }

  const o = { topic, topicContent, Lv1CommentsPageNum, Lv1Comments, isMoreLv1Comment };
  //  需要查活跃用户和推荐内容）
  if (hasSideContent) {
    await Promise.all([
      // 查活跃用户
      app.httpRequest(UserService.selectList({ pageNum: 1, pageSize: 15 }, '/f'), {context}),
      // 查推荐话题内容
      app.httpRequest(TopicContentService.selectRecommendList({ type: 0, pageNum: 1, pageSize: 10 }, '/f'), {context})
    ]).then((datas: any) => {
      const data0 = datas[0];
      const data1 = datas[1];
      if (data0.users) { activeUsers = data0.users; }
      if (data1.topicContents) { recommendTopicContents = data1.topicContents; }
    });
    Object.assign(o, { activeUsers, recommendTopicContents });
  }
  app.setAsyncData(o);
  app.handler.unload();
  return o;
}
@Component({
  layout: "app",
  components: {
    ReplyComponent,
    SidebarComponent,
    PageBarComponent
  },
  filters: {
    vip,
    strCut
  },
  asyncData
})
export default class DetailComponent extends BaseComponent {
  @Ref("childReply")
  childReplyRef!: any;
  /** 话题内容id */
  id: number = -1;
  /** 话题内容详情 */
  topicContent: any = {};
  /** 所属话题 */
  topic: any = {};
  /** 回复 */
  reply: string = "";
  /** 顶级评论 */
  Lv1Comments: any = [];
  /** 是否显示2级回复输入框，默认不显示 */
  showChildReply: boolean = false;
  /** 获取楼层作者信息 */
  get user() {
    return this.topicContent.user || {};
  }
  /** 获取楼层作者角色 */
  get roles() {
    if (!this.topicContent.user || !this.topicContent.user.roles) return [];
    return this.topicContent.user.roles;
  }

  /** 获取vip或svip */
  get vip() {
    const names: string[] = this.roles.map((role: any) => {
      return role.name;
    });
    if (names.includes("vip")) return { identity: "vip", name: "会员" };
    if (names.includes("svip")) return { identity: "svip", name: "超级会员" };
    return {};
  }
  /** 1级回复 */
  replyObj0 = {
    /** 父级回复id */
    pid: -1,
    /** 给谁回复，被回复者id */
    wid: -1,
    /** 回复者id */
    uid: -1,
    /** 所属话题内容id */
    tcid: -1,
    /** 回复内容 */
    text: "",
    /** 回复提示（不上送） */
    placeholder: ''
  };
  /** 2级及以上回复 */
  replyObj1 = {
    /** 父级回复id */
    pid: -1,
    /** 给谁回复，被回复者id */
    wid: -1,
    /** 回复者id */
    uid: -1,
    /** 所属话题内容id */
    tcid: -1,
    /** 回复内容 */
    text: "",
    /** 回复提示（不上送） */
    placeholder: ''
  };
  /** 回复的父回复（要对该1级或其子回复进行回复） */
  parentComment: any = {};
  /** 对谁回复 */
  toWho: any = {};
  /** 1级回复当前页，默认1 */
  Lv1CommentPageNum = 1;
  /** 1级回复分页大小，默认10 */
  Lv1CommentPageSize = 10;
  /** 2级及以上回复的初始显示数目，默认为4 */
  GTLv1CommentCount = 4;
  /** 2级及以上回复分页大小，默认5 */
  GTLv1CommentPageSize = 5;
  /** 是否有更多 */
  isMoreLv1Comment: boolean = false;
  /** 活跃用户 */
  activeUsers: any[] = [];
  /** 推荐话题内容 */
  recommendTopicContents: any[] = [];

  constructor() {
    super();
  }

  activated() {
    this.getAsyncDataToThisInActivated();  
  }

  /**
   * 话题封面显示遮罩
   * @param v 话题
   */
  showMask(v: any) {
    if (v.mask === undefined) {
      this.$set(v, 'mask', true);
    } else {
      v.mask = true;
    }
  }

  /**
   * 
   * @param v 话题
   */
  hideMask(v: any) {
    v.mask = false;
  }


  /**
   * 查询话题内容顶级评论带4条回复
   */
  getFirstComments() {
    const obj = {
      tcid: this.topicContent.id,
      pid: -1,
      pageNum1: this.Lv1CommentPageNum,
      pageNum2: 1,
      pageSize1: this.Lv1CommentPageSize,
      pageSize2: this.GTLv1CommentPageSize
    }
      this.httpRequest(TopicCommentService.selectList(obj, '/f'), {
      success: (data: any) => {
        const topicComments = data.topicComments;
        if (!topicComments.length) return;
        this.isMoreLv1Comment = topicComments.length === this.Lv1CommentPageSize;
        // 计算父级回复者等级
        topicComments.forEach((topReply: any) => {
          this.getUserLevel(topReply.user);
          // 计算二级回复回复者等级
          topReply.comments.forEach((comment: any) => {
            this.getUserLevel(comment.user);
          });
        });
        this.Lv1Comments = this.Lv1Comments.concat(topicComments);
      }
    });
  }

  /**
   * 获取2级及以上回复
   * @param v {any} 父级回复
   */
  getSecondeComments(v: any) {
    const obj = {
      pid: v.id,
      pageNum2: v.pageNum || 1,
      pageSize2: this.GTLv1CommentPageSize
    }
    this.httpRequest(TopicCommentService.selectList(obj, '/f'), {
      success: (data: any) => {
        const pageInfo = data.pageInfo;
        const comments = pageInfo.list;
        // 计算二级回复列表的用户等级
        comments.forEach((comment: any) => {
          this.getUserLevel(comment.user);
        });
        // 一级回复对应的子回复列表
        v.comments = comments;
        // 如果满足分页条件，
        // 会给1级回复设置pageInfo响应式属性
        if (pageInfo.pages > 1) {
          if (!v.pageInfo) {
            this.$set(v, 'pageInfo', pageInfo);
            // 不显示查看更多，显示分页
            this.$set(v, 'changeToPaging', true);
          }
          v.pageInfo = pageInfo;
        }
      }
    });
  }

  /**
   * 点击对贴回复，设置话题内容的回复信息
   * @param v 话题内容
   */
  setTopReply(v: any) {
    this.replyObj0.placeholder = "回帖:";
    this.replyObj0.wid = v.uid;
    // 这里表示1级回复，不要设置为话题内容的id！！！
    // 因为：1.tcid就是话题内容id，2.后台查询1级回复是pid=-1来查
    this.replyObj0.pid = -1;
    this.replyObj0.tcid = v.id;
  }

  /**
   * 点击1级回复或其子回复的回复按钮
   * 
   * 这里让2级要回复的pid都设为1级回复的id，使2级以上回复成为1级回复的直接子回复
   * 
   * 在一级回复中，把回复组件追加到ref中(已追加则不追加)，
   * 设置对一级或二级回复的父级回复信息
   * @param ref 回复组件的父容器
   * @param v 1级回复及以上回复
   * @param type 1 - 对一级回复进行回复，2-对二级回复进行回复
   * @paren p 父回复
   */
  openAndSetChildReply(ref: any, v: any, type: number, p: any) {
    if (!this.curUser) {return this.handler.toast({text:'请先登录~'})};
    // 显示子级回复组件
    if (!this.showChildReply) this.showChildReply = true;
    const c = ref[0];
    const childs = c.children;
    const clen = childs.length;
    const o = this.childReplyRef.$el;
    if (childs[clen - 1] !== o) {
      c.insertBefore(o, childs[clen]);
    }
    this.replyObj1.text = '';
    // 设置父回复,2级及以上回复的父回复都是这个
    this.parentComment = p;
    // 设置2机以及上的父回复id
    let pid = p.id;
    if (type === 1) this.replyObj1.placeholder = "跟评:";
    else {
      this.toWho = v.user;
      this.replyObj1.placeholder = "@" + v.user.nickname + ":";
    }
    this.replyObj1.pid = pid;
    this.replyObj1.wid = v.uid;
    this.replyObj1.tcid = v.tcid;
  }

  /**
   * 提交回复
   * @param  {string} reply - 回复
   * @param type 0 - 对问题回复，1 - 对1级回复或2级及以上回复
   */
  submit(reply: any, type: number) {
    if (!reply.text) return;
    reply.uid = this.curUser.id;
    reply.device = this.$$.isMB()?2:1;
    // 要提交的回复实体
    const reply$ = this.clone(reply);
    reply$.createTime = DateUtil.now();
    reply$.text = this.xss(reply$.text);
    this.httpRequest(this.http.post("/topicComment/f/insert/one", reply$), {
      success: () => {
        this.handler.toast({ text: "回复成功" });
        reply$.user = this.curUser;
        if(type === 0) { // 对贴回复
          this.Lv1Comments.unshift(reply$);
        } else if (type === 1) { // 对1级或2级及以上回复
          reply$.who = this.toWho;
          this.parentComment.commentCount++;
          if (this.parentComment.commentCount <= this.GTLv1CommentPageSize) {
            this.parentComment.comments.push(reply$);
            return;
          }
          if (this.parentComment.pageNum === undefined) {
            this.$set(this.parentComment, 'pageNum', 1);
          }
          this.parentComment.pageNum++;
          this.getSecondeComments(this.parentComment);
        }
      }
    });
  }

  /**
   * 点击1级回复查看更多
   * @param v 1级回复
   */
  pagingQuery(v: any) {
    // 挂载一个属性：当前页为1
    v.pageNum = 1;
    this.getSecondeComments(v);
  }

  /**
   * 2级及以上回复分页跳转
   * @param v 1级回复
   * @param e 分页参数
   */
  toPage(v: any, e: any) {
    v.pageNum = e.pageNum;
    this.getSecondeComments(v);
  }

  /**
   * 是否关注或收藏
   * @param v 话题或话题内容
   */
  getConcern(v: any): number {
    if (process&&process.server) return 0;
    if (!v.concernInfo){
      this.$set(v, 'concernInfo', {concern: 0});
    }
    return v.concernInfo.concern;
  }

  /**
   * 获取点赞状态1-点赞，2-反对，3-无状态
   * @param {any} v - 话题内容或回复
   */
  getThumb(v: any) {
    if(process&&process.server) return 3;
    if (!v.thumbInfo) {
      this.$set(v, 'thumbInfo', {thumb: 3});
      return 3;
    }
    return v.thumbInfo.thumb;
  }

  /**
   * 收藏话题内容/关注话题，无则插入，有则更新
   * @param v 话题内容
   */
  @Throttle(3000, (o: DetailComponent) => {
    o.handler.toast({text: '请不要频繁操作~'});
  })
  collect(v: any){
    if (!this.curUser) {return this.handler.toast({text:'请先登录~'})};
    // 1-收藏，0-取消收藏
    let concern = this.getConcern(v) === 1? 0 : 1;
    // 1-收藏话题内容，2-关注话题
    const type = v === this.topic? 2 : 1;
    const obj = {
      oid: v.id,
      type,
      concern,
      uid: this.curUser.id
    }
    const flag = concern === 1;
    this.httpRequest(this.http.post('/concern/f/insertOrUpdate/one', obj), {
      success: () => {
        this.handler.toast({text: (flag?'':'取消')+(type===2?'关注':'收藏')+'成功~'});
        if (!flag) { // 取消收藏
          v.concernCount--;
          v.concernInfo.concern = 0;
        } else { // 收藏
          v.concernCount++;
          v.concernInfo.concern = 1;
        }
      }
    });
  }

  /**
   * 点赞，有则更新，无则插入，和反对互斥，且和反对是修改的统一字段
   * @param v 话题内容或回复
   * @param {number} type 1 - 话题内容，2-话题内容回复
   */
  @Throttle(3000, (o: DetailComponent) => {
    o.handler.toast({text: '请不要频繁操作~'});
  })
  thumbup(v: any, type: number) {
    if (!this.curUser) {return this.handler.toast({text:'请先登录~'})};
    let thumb = this.getThumb(v);
    // 1-点赞，3-取消点赞
    thumb = (thumb === 3 || thumb === 2) ? 1 : 3;
    const obj = {
      oid: v.id,
      type,
      thumb,
      uid: this.curUser.id
    }
    const flag = thumb === 1;
    this.httpRequest(this.http.post('/thumb/f/insertOrUpdate/one', obj), {
      success: () => {
        this.handler.toast({text: (flag?'':'取消')+'点赞成功~'});
        if (!flag) { // 取消点赞
          v.thumbupCount--;
          v.thumbInfo.thumb = 3;
        } else { // 点赞
          v.thumbupCount++;
          if (v.thumbInfo.thumb === 2) { // 之前反对了，取消反对
            v.thumbdown--;
          }
          v.thumbInfo.thumb = 1;
        }
      }
    });
  }

  /**
   * 反对，有则更新，无则插入，和点赞互斥，且和点赞是修改的统一字段
   * @param v 话题内容或回复
   * @param {number} type 1 - 话题内容，2-话题内容回复
   */
  @Throttle(3000, (o: DetailComponent) => {
    o.handler.toast({text: '请不要频繁操作~'});
  })
  thumbdown(v: any, type: number) {
    if (!this.curUser) {return this.handler.toast({text:'请先登录~'})};
    let thumb = this.getThumb(v);
    // 2-反对，3-取消反对
    thumb = (thumb === 3 || thumb === 1) ? 2 : 3;
    const obj = {
      oid: v.id,
      type,
      thumb,
      uid: this.curUser.id
    }
    const flag = thumb === 2;
    this.httpRequest(this.http.post('/thumb/f/insertOrUpdate/one', obj), {
      success: () => {
        this.handler.toast({text: (flag?'':'取消')+'反对成功~'});
        if (!flag) { // 取消反对
          v.thumbdownCount--;
          v.thumbInfo.thumb = 3;
        } else { // 反对
          v.thumbdownCount++;
          if (v.thumbInfo.thumb === 1) { // 之前点赞了，取消点赞
            v.thumbupCount--;
          }
          v.thumbInfo.thumb = 2;
        }
      }
    });
  }

  /**
   * 查看更多一级评论
   */
  seeMore() {
    this.Lv1CommentPageNum++;
    this.getFirstComments();
  }

  /**
   * 取当前页
   */
  toCurrentPage(e: any) {
    e.preventDefault();
    asyncData(this.context).then(() => {
      this.getAsyncDataToThisInActivated();
    });
  }
}
