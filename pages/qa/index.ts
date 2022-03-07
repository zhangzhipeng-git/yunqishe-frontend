/*
* Filename: d:\frontend\vue\nuxt-ssr\pages\zhixing\zhixing.ts
* Path: d:\frontend\vue\nuxt-ssr
* Created Date: Saturday, December 21st 2019, 10:28:19 pm
* Author: zzp-dog
* 问云
* Copyright (c) 2019 Your Company
*/

import Component from 'vue-class-component';
import strCut from '~/core/modules/filters/strCut';
import vip from '@/core/modules/filters/vip';
import { Context } from '@nuxt/types';
import BaseComponent from '~/core/base-component';
import SidebarComponent from '@/core/modules/components/projections/sidebar/sidebar.vue';
import FilterSpreadComponent from '../../core/modules/components/commons/filter-spread/filter-spread'
import NoResultComponent from '../../core/modules/components/commons/no-result/no-result';
import TopicClassService from '~/service/topic-class';
import TopicContentService from '../../service/topic-content/index';
import UserService from '../../service/user/index';
import ConcernService from '../../service/concern/index';
const options = {
    layout: 'app',
    components: {
        SidebarComponent,
        FilterSpreadComponent,
        NoResultComponent
    },
    filters: {
        vip,
        strCut
    },
    async asyncData(context: Context) {
        if (QAComponent.activated) return;
        const app = BaseComponent.getSingleton();
        app.handler.load();
        let classify = { concern: [], recommend: [] };
        let topicContents: any[] = [];
        let isMoreTopicContent: boolean = false;
        let hasSideContent = !0;
        let activeUsers: any = [];
        let recommendTopicContents: any = [];
        const pageNum = 1;
        const pageSize = 10;
        const pageNum2 = 1;
        const pageNum3 = 1;
        const pageSize2 = 15;
        const pageSize3 = 10;
        await Promise.all([
            app.httpRequest(TopicClassService.selectList({ type: 1, max: 7 }, '/f'), {context}),
            app.httpRequest(TopicContentService.selectList({ type1: 1, pageNum, pageSize}, '/f'), {context})
        ]).then((datas: any) => {
            const data0 = datas[0];
            const data1 = datas[1];
            const topicClasses = data0.topicClasses;
            if (topicClasses) {
                if (topicClasses.concern) {
                    topicClasses.concern.unshift({ id: -1, name: '全站' });
                }
                classify = topicClasses;
            }
            const topicContents$ = data1.topicContents;
            if (topicContents$) {
                isMoreTopicContent = topicContents.length === pageSize;
                topicContents = topicContents$;
            }
        });
        const o = { classify, topicContents, isMoreTopicContent };
        //  需要查活跃用户和推荐内容）
        if (hasSideContent) {
            await Promise.all([
                // 查活跃用户
                app.httpRequest(UserService.selectList({ pageNum: pageNum2, pageSize: pageSize2 }, '/f'), {context}),
                // 查推荐话题内容
                app.httpRequest(TopicContentService.selectRecommendList({ type: 1, pageNum: pageNum3, pageSize: pageSize3 }, '/f'), {context})
            ]).then((datas: any) => {
                const data0 = datas[0];
                const data1 = datas[1];
                if (data0.users) { activeUsers = data0.users; }
                if (data1.topicContents) { recommendTopicContents = data1.topicContents; }
            });
            Object.assign(o, { activeUsers, recommendTopicContents });
        }
        app.handler.unload();
        return o;
    }
}
@Component(options)
export default class QAComponent extends BaseComponent {
    /** 关注分类 */
    classify: any = null;
    /** 当前选择话题分类的id,默认-1表示全站 */
    topicId: number = -1;
    /** 当前页 */
    pageNum: number = 1;
    /** 分页大小 */
    pageSize: number = 10;
    /** 是否有更多 */
    isMoreTopicContent: boolean = false;
    /** 内容列表 */
    topicContents: any[] = [];
    /** 活跃用户 */
    activeUsers: any[] = [];
    /** 推荐话题内容 */
    recommendTopicContents: any[] = [];

    constructor() {
        super();
    }

    activated() {
        QAComponent.activated = true;
    }
    destoryed() {
        QAComponent.activated = false;
    }

    /**
     * 查列表
     * @param isConcat 是否查看更多
     */
    getContentList(isConcat: boolean = false) {
        this.handler.load();
        this.httpRequest(TopicContentService.selectList({type1: 1, pid: this.topicId, pageNum: this.pageNum, pageSize: this.pageSize}, '/f'), {
            success: (data: any) => {
                const topicContents = data.topicContents;
                this.isMoreTopicContent = topicContents.length === this.pageSize;
                if (isConcat) { 
                    // 查看更多
                    this.topicContents = this.topicContents.concat(topicContents);
                } else { 
                    // 筛选重查
                    this.topicContents = topicContents;
                }
                this.handler.unload();
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
        this.isMoreTopicContent = false;
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
            return;
        }
        this.httpRequest(ConcernService.batchInsert(1, ids, '/f'), {
            success: () => this.handler.unload(),
            error: () => {
                const classes = this.clone(this.classify);
                this.classify = classes;
                return true;
            }
        });
    }

    /**
     * 点击查看更多
     */
    seeMore() {
        this.pageNum++;
        this.getContentList(true);
    }

    /**
     * 去推荐的帖子
     * @param invitation 帖子 
     */
    goTopicContent(v: any) {
        const pid = v.pid;
        this.httpRequest(this.http.get('/topicClass/f/select/one?id=' + pid), {
            success: (data: any) => {
                this.localStorage.setItem('topic-qa', data.topicClass);
                this.$router.push('/qa/detail?id=' + v.id);
            }
        });
    }
}