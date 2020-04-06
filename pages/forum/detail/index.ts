/*
* Filename: d:\frontend\vue\nuxt-ssr\pages\forum\detail\_id.ts
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
import BaseComponent from "@/core/base-component.ts";
import vip from '@/core/modules/filters/vip';
import strCut from '~/core/modules/filters/strCut';
import { Ref } from "vue-property-decorator";
import DateUtil from "~/core/modules/util/date-util";

const options: any = {
  layout: "app",
  components: {
    ReplyComponent,
    SidebarComponent,
    PageBarComponent
  },
  filters: {
    vip,
    strCut
  }
};
@Component(options)
export default class DetailComponent extends BaseComponent {
  /** 话题内容id */
  id: number = -1;
  /** 话题内容详情 */
  invitation: any = {};
  /** 所属版块 */
  block: any = {};
  /** 回复 */
  reply: string = "";
  /** 顶级评论 */
  topReplys: any = [];
  /** 是否显示2级回复输入框，默认不显示 */
  showChildReply: boolean = false;
  @Ref("childReply")
  childReplyRef!: any;
  /** 获取楼层作者信息 */
  get user() {
    return this.invitation.user || {};
  }
  /** 获取楼层作者角色 */
  get roles() {
    if (!this.invitation.user || !this.invitation.user.roles) return [];
    return this.invitation.user.roles;
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
  /** 1级回复当前页，默认0 */
  Lv1CommentPageNum = 1;
  /** 1级回复分页大小，默认10 */
  Lv1CommentPageSize = 10;
  /** 2级及以上回复的初始显示数目，默认为4 */
  GTLv1CommentCount = 4;
  /** 2级及以上回复分页大小，默认5 */
  GTLv1CommentPageSize = 5;
  /** 是否有更多 */
  noMore: boolean = false;
  /** 活跃用户 */
  activeUsers: any[] = [];
  /** 推荐帖子 */
  recommendInvitations: any[] = [];

  constructor() {
    super();
  }

  activated() {
    const id = parseInt(<string>this.$route.query.id, 10);
    this.init(id);
  }

  async init(id: number) {
    this.id = id;
    this.noMore = false;
    this.Lv1CommentPageNum = 0;
    this.topReplys = [];
    this.block = this.localStorage.getItem('block');
    // 查询话题内容详情
    await this.getInvitationDetail();
    // 查询话题内容评论
    this.getFirstComments();
    // 查活跃用户
    this.getActiveUsers();
    // 查推荐话题内容
    this.getRecommendInvitations();
    // 获取定位
    this.getLocation({
      success: (data: any) => {
        console.log(data);
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  /**
   * 查询话题内容详情
   */
  getInvitationDetail() {
    return this.httpRequest(
      this.http.get("/topicContent/f/select/one?id=" + this.id),
      {
        success: (data: any) => {
          this.invitation = data.topicContent;
          // 计算用户等级
          this.getUserLevel(this.user);
        }
      }
    );
  }

  /**
   * 查询话题内容顶级评论带4条回复
   */
  getFirstComments() {
    if (this.noMore)return;
    const queryStr =
      "?tcid=" +
      this.invitation.id +
      "&pid=-1&pageNum1="+this.Lv1CommentPageNum+"&pageSize1=10&pageNum2=1&pageSize2=4";
    this.httpRequest(this.http.get("/topicComment/f/select/list" + queryStr), {
      success: (data: any) => {
        if (data.topicComments.length) 
          this.noMore = false;
        else {
          this.noMore = true;
          return;
        }
        const comments = data.topicComments as [];
        // 计算父级回复者等级
        comments.forEach((topReply: any) => {
          this.getUserLevel(topReply.user);
          // 计算二级回复回复者等级
          topReply.comments.forEach((comment: any) => {
            this.getUserLevel(comment.user);
          });
        });
        this.topReplys = this.topReplys.concat(comments);
      }
    });
  }

  /**
   * 获取2级及以上回复
   * @param v {any} 父级回复
   */
  getSecondeComments(v: any) {
    const queryStr = "?pid=" + v.id + "&pageNum2="+(v.pageNum||1) 
    + "&pageSize2=" + this.GTLv1CommentPageSize;
    this.httpRequest(this.http.get("/topicComment/f/select/list" + queryStr), {
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
   * 在一级回复中，把回复组件追加到ref中(已追加则不追加)，
   * 设置对一级或二级回复的父级回复信息
   * @param ref 回复组件的父容器
   * @param v 1级回复及以上回复
   * @param type 1 - 对一级回复进行回复，2-对二级回复进行回复
   * @param p - 父回复，一级回复不需要父回复
   */
  openAndSetChildReply(ref: any, v: any, type: number, p: any) {
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
    // 设置对谁回复
    this.parentComment = p;
    // 对1级回复的回复
    let pid = -1;
    if (type === 1) this.replyObj1.placeholder = "跟评:";
    else {
      pid = p.id;
      this.toWho = v.user;
      this.replyObj1.placeholder = "@" + v.user.nickname + ":";
    }
    this.replyObj1.pid = pid; // v.id总为1级回复的id template 中 item_.id=item.id
    this.replyObj1.wid = v.uid;
    this.replyObj1.tcid = v.tcid;
  }

  /**
   * 提交回复
   * @param  {string} reply - 回复
   * @pran type 0 - 对帖子回复，1 - 对1级回复或2级及以上回复
   */
  submit(reply: any, type: number) {
    if (!reply.text) return;
    reply.uid = this.curUser.id;
    reply.device = this.$$.isMB()?2:1;
    this.httpRequest(this.http.post("/topicComment/f/insert/one", reply), {
      success: () => {
        this.handler.toast({ text: "回复成功" });
        if(type === 0) { // 对贴回复
          reply.user = this.curUser;
          reply.createTime = DateUtil.now();
          this.topReplys.unshift(reply);
        } else if (type === 1) { // 对1级或2级及以上回复
          reply.who = this.toWho;
          this.parentComment.commentCount++;
          if (this.parentComment.commentCount <= this.GTLv1CommentPageSize) {
            this.parentComment.comments.push(reply);
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
    if (!v.concernInfo){
      this.$set(v, 'concernInfo', {concern: 0});
    }
    return v.concernInfo.concern;
  }

  /**
   * 收藏话题内容/关注版块，无则插入，有则更新
   * @param v 话题内容
   */
  collect(v: any){
    if (!this.curUser) {this.handler.toast({text:'请先登录~'})};
    // 1-收藏，0-取消收藏
    let concern = this.getConcern(v) === 1? 0 : 1;
    // 1-收藏话题内容，2-关注话题
    const type = 
    v === this.block? 2 : 1;
    const obj = {
      oid: v.id,
      type,
      concern,
      uid: this.curUser.id
    }
    const flag = concern === 1;
    this.httpRequest(this.http.post('/concern/f/insertOrUpdate/one', obj, {throttle:3000}), {
      success: () => {
        this.handler.toast({text: (flag?'':'取消')+(type===2?'关注':'收藏')+'成功~'});
        if (!flag) { // 取消收藏
          v.concern--;
          v.concernInfo.concern = 0;
        } else { // 收藏
          v.concern++;
          v.concernInfo.concern = 1;
        }
        if (type===2){
          this.localStorage.setItem('block',v);
        }
      }
    });
  }
  
  /**
   * 获取点赞状态1-点赞，2-反对，3-无状态
   * @param {any} v - 话题内容或回复
   */
  getThumb(v: any) {
    if (!v.thumbInfo) {
      this.$set(v, 'thumbInfo', {thumb: 3});
      return 3;
    }
    return v.thumbInfo.thumb;
  }

  /**
   * 点赞，有则更新，无则插入，和反对互斥，且和反对是修改的统一字段
   * @param v 话题内容或回复
   * @param {number} type 1 - 话题内容，2-话题内容回复
   */
  thumbup(v: any, type: number) {
    if (!this.curUser) {this.handler.toast({text:'请先登录~'})};
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
    this.httpRequest(this.http.post('/thumb/f/insertOrUpdate/one', obj, {throttle: 3000}), {
      success: () => {
        this.handler.toast({text: (flag?'':'取消')+'点赞成功~'});
        if (!flag) { // 取消点赞
          v.thumbup--;
          v.thumbInfo.thumb = 3;
        } else { // 点赞
          v.thumbup++;
          if (v.thumbInfo.thumb === 2) { // 之前反对了，取消反对
            v.thumbdonw--;
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
  thumbdown(v: any, type: number) {
    if (!this.curUser) {this.handler.toast({text:'请先登录~'})};
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
    this.httpRequest(this.http.post('/thumb/f/insertOrUpdate/one', obj,{throttle: 3000}), {
      success: () => {
        this.handler.toast({text: (flag?'':'取消')+'反对成功~'});
        if (!flag) { // 取消反对
          v.thumbdown--;
          v.thumbInfo.thumb = 3;
        } else { // 反对
          v.thumbdown++;
          if (v.thumbInfo.thumb === 1) { // 之前点赞了，取消点赞
            v.thumbup--;
          }
          v.thumbInfo.thumb = 2;
        }
      }
    });
  }

  /**
   * 获取活跃用户
   */
  getActiveUsers() {
    this.httpRequest(this.http.get('/user/f/select/active/list?pageSize=15'), {
      success: (data: any) => {
        this.activeUsers = data.users;
      }
    })
  }

  /**
   * 获取推荐话题内容
   */
  getRecommendInvitations() {
    this.httpRequest(this.http.get('/topicContent/f/select/recommend/list?wt=0&pageSize=10'), {
      success: (data: any) => {
        this.recommendInvitations = data.topicContents;
      }
    })
  }

  /**
   * 去个人中心
   * @param user 用户
   */
  goUserCenter(user: any) {
    this.$router.push('/user?id=' + user.id);
  }

  /**
   * 去推荐的帖子
   * @param invitation 帖子 
   */
  goInvitation(v: any) {
    const tid = v.tid;
    this.httpRequest(this.http.get('/topic/f/select/one?id='+tid), {
      success: (data: any) => {
          this.localStorage.setItem('block', data.topic);
          this.init(v.id);
      }
    });
  }

  seeMore() {
    this.Lv1CommentPageNum++;
    this.getFirstComments();
  }
}
