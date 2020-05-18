/*
* Filename: d:\frontend\vue\nuxt-ssr\pages\zhixing\zhixing.ts
* Path: d:\frontend\vue\nuxt-ssr
* Created Date: Saturday, December 21st 2019, 10:28:19 pm
* Author: zzp-dog
* 问云
* Copyright (c) 2019 Your Company
*/

import Component from 'vue-class-component';
import SidebarComponent from '@/core/modules/components/projections/sidebar/sidebar.vue';
import FilterSpreadComponent from '@/core/modules/components/commons/filter-spread/filter-spread.vue'
import strCut from '~/core/modules/filters/strCut';
import vip from '@/core/modules/filters/vip';
import BaseComponent from '~/core/base-component';
const options = {
    layout: 'app',
    components: {
        SidebarComponent,
        FilterSpreadComponent
    },
    filters: {
        vip,
        strCut
    }
}
@Component(options)
export default class qaComponent extends BaseComponent {
    /** 关注分类 */
    classify: any = null;
    /** 当前选择话题分类的id,默认-1表示全站 */
    topicId: number = -1;
    /** 当前页 */
    pageNum: number = 1;
    /** 分页大小 */
    pageSize: number = 10;
    /** 是否有更多 */
    noMore: boolean = false;
    /** 内容列表 */
    list: any [] = [];
    /** 活跃用户 */
    activeUsers: any[] = [];
    /** 推荐话题内容 */
    recommendTopicContents: any[] = [];


    constructor() {
        super();
    }



    activated() {
        this.reset();
        this.getClassify();
        this.getContentList();
        this.getActiveUsers();
        this.getRecommendTopicContents();
    }

    /**
     * 查询已关注分类和未关注分类，因为组件的限制，总共只查7个
     */
    getClassify() {
        this.httpRequest(this.http.get('/topicClass/f/select/list?type=1&max=7'), {
            success: (data: any) => {
                const topicClasses = data.topicClasses;
                if (topicClasses.concern) {
                    topicClasses.concern.unshift({id: -1, name:'全站'});
                } 
                this.classify = data.topicClasses;
            }
        });
    }

    /**
     * 查列表
     */
    getContentList() {
        const qstr = '?type=1&pid='+this.topicId
        +'&pageNum='+this.pageNum+'&pageSize='+this.pageSize;
        this.httpRequest(this.http.get('/topicContent/f/select/list'+qstr), {
            success: (data: any) => {
                const topicContents = data.topicContents;
                if (!topicContents.length) {
                    this.noMore = true;
                }
                this.list = this.list.concat(data.topicContents);
            }
        });
    }

    /**
     * 选择某个话题
     * @param v 话题
     */
    select(v: any) {
        this.topicId = v.id;
        this.pageNum = 1;
        this.noMore = false;
        this.reset();
        this.getContentList();
    }

    /**
     * 更新关注
     * @param ids 新的关注话题的id数组
     */
    updateConcern(ids: any) {
        this.handler.load();
        if (!this.curUser) {
            this.toLogin();
        }
        this.httpRequest(this.http.post('/concern/f/qa/batch/insert', ids), {
            success: () => this.handler.unload(),
            error: () => {
                const classes = this.clone(this.classify);
                this.classify = classes;
                return true;
            }
        });
    }

    /**
     * 去列表项目详情
     * 1.查所属话题
     * 2.去话题内容页
     * @param v 话题内容（不含
     */
    toDetail(v: any) {
        this.httpRequest(this.http.get('/topicClass/f/select/one?id='+v.pid), {
            success: (data: any) => {
                this.localStorage.setItem('topic-qa', data.topicClass);
                this.$router.push('/qa/detail?id='+v.id);
            }
        });
    }

    /**
     * 点击查看更多
     */
    seeMore() {
        this.pageNum++;
        this.getContentList();
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
  getRecommendTopicContents() {
    this.httpRequest(this.http.get('/topicContent/f/select/recommend/list?type=1&pageSize=10'), {
      success: (data: any) => {
        this.recommendTopicContents = data.topicContents;
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
  goTopicContent(v: any) {
    const pid = v.pid;
    this.httpRequest(this.http.get('/topicClass/f/select/one?id='+pid), {
      success: (data: any) => {
          this.localStorage.setItem('topic-qa', data.topicClass);
          this.$router.push('/qa/detail?id='+v.id);
      }
    });
  }
}