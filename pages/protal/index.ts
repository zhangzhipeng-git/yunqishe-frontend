/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\pages\protal\index.ts
 * Created Date: Sunday, December 15th 2019, 10:41:15 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 云启社首页
 * Last Modified: Thursday July 9th 2020 9:45:10 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

import Component from 'vue-class-component';
import CarouselComponent from '@/core/modules/components/commons/carousel/carousel.vue'
import BaseComponent from '../../core/base-component';
import strCut from '../../core/modules/filters/strCut';
import SelectComponent from '../../core/modules/components/commons/form/select/select';
import NoResultComponent from '../../core/modules/components/commons/no-result/no-result';
import ImageDisposeService from '~/service/image-dispose';
import TopicContentService from '~/service/topic-content';
import UserService from '~/service/user';
/** 内容详情页url */
const contentDetailUrl = (item: any) => {
    return (item.type === 0 ? '/circle' : '/qa')+'/detail?id='+item.id+'&pid='+item.pid;
}
/** 组件配置选项 */
const options: any = {
    layout: 'app',
    components: {
        CarouselComponent,  //轮播图组件
        SelectComponent,    //下拉/上拉选择组件
        NoResultComponent,  //无数据组件
    },
    filters: {
        strCut,             // 字符超长截取
        contentDetailUrl    // 内容详情页url
    },
    /** 服务端请求和客户端请求通用代码 */
    async asyncData(context: any) {
        if (ProtalIndexComponent.activated) return;
        const app = BaseComponent.getSingleton();
        let imgList = <any>null,
            imgHasData = false,
            topList = <any>null,
            topHasData = false,
            isMoreTop = false,
            recentList = <any>null,
            recentHasData = false,
            isMoreRecent = false,
            hotList = <any>null,
            hotHasData = false,
            isMoreHot = false,
            randomList = <any>null,
            randomHasData = false,
            isMoreRandom = false,
            userList = <any>null,
            userHasData = false,
            isMoreUser = false;
        app.handler.load();
        await Promise.all([
            // 轮播图
            app.httpRequest(ImageDisposeService.selectList({type:1}, '/f'), context),
            // 分页查询置顶内容 type2=6&pageNum=1&pageSize=5
            app.httpRequest(TopicContentService.selectList({type2:1, isFree: true, pageNum: 1, pageSize: 5}, '/f'), context),
            // 分页查询最近内容 type2=2&pageNum=1&pageSize=24
            app.httpRequest(TopicContentService.selectList({type2:2, isFree: true, pageNum: 1, pageSize: 24}, '/f'), context),
            // 分页查询热点内容
            app.httpRequest(TopicContentService.selectList({type2:4, isFree: true, pageNum: 1, pageSize: 24}, '/f'), context),
            // 分页查询随机内容
            app.httpRequest(TopicContentService.selectList({type2:5, isFree: true, pageNum: 1, pageSize: 24}, '/f'), context),
            // 分页查询用户列表（sex不送值-默认为全部，type不送值-默认也是全部）
            app.httpRequest(UserService.selectList({pageNum:1, pageSize: 32}, '/f'), context)
        ]).then((datas: any[]) => {
            const data0 = datas[0];
            const data1 = datas[1];
            const data2 = datas[2];
            const data3 = datas[3];
            const data4 = datas[4];
            const data5 = datas[5];
            if (data0 && data0.imageDisposes) {
                imgList = data0.imageDisposes;
                imgHasData = !app.isEmpty(imgList);
            }
            if (data1 && data1.topicContents) {
                topList = data1.topicContents;
                topHasData = !app.isEmpty(topList);
                isMoreTop = topList && topList.length === 5;
            }
            if (data2 && data2.topicContents) {
                recentList = data2.topicContents;
                recentHasData = !app.isEmpty(recentList);
                isMoreRecent = recentList && recentList.length === 24
            }
            if (data3 && data3.topicContents) {
                hotList = data3.topicContents;
                hotHasData = !app.isEmpty(hotList);
                isMoreHot = hotList && hotList.length === 24;
            }
            if (data4 && data4.topicContents) {
                randomList = data4.topicContents;
                randomHasData = !app.isEmpty(randomList);
                isMoreRandom = randomList && randomList.length === 24
            }
            if (data5 && data5.users) {
                userList = data5.users;
                userHasData = !app.isEmpty(userList);
                isMoreUser = userList && userList.length === 32;
            }
        })
        app.handler.unload();
        return {
            imgList,
            imgHasData,
            topList,
            topHasData,
            isMoreTop,
            recentList,
            recentHasData,
            isMoreRecent,
            hotList,
            hotHasData,
            isMoreHot,
            randomList,
            randomHasData,
            isMoreRandom,
            userList,
            userHasData,
            isMoreUser
        };
    },
}
@Component(options)
export default class ProtalIndexComponent extends BaseComponent {

    /** 轮播图片url列表 */
    imgList: any = [];
    /** 轮播图不为空 */
    imgHasData: any = false;
    /** 置顶内容列表 */
    topList: any = [];
    /** 置顶内容不为空 */
    topHasData: any = false;
    /** 最近内容列表*/
    recentList: any = [];
    /** 最近内容不为空 */
    recentHasData: any = false;
    /** 热点内容列表 */
    hotList: any = [];
    /** 热点内容不为空 */
    hotHasData: any = false;
    /** 随即内容列表 */
    randomList: any = [];
    /** 随即内容不为空 */
    randomHasData: any = false;
    /** 用户列表 */
    userList: any = [];
    /** 用户不为空 */
    userHasData: any = false;

    /** 是否置顶内容更多（每次查完满了一页才为true，此时会显示更多按钮） */
    isMoreTop: boolean = true;
    /** 是否最近内容更多（每次查完满了一页才为true，此时会显示更多按钮） */
    isMoreRecent: boolean = true;
    /** 是否热点内容更多（每次查完满了一页才为true，此时会显示更多按钮） */
    isMoreHot: boolean = true;
    /** 是否随机内容更多（每次查完满了一页才为true，此时会显示更多按钮） */
    isMoreRandom: boolean = true;
    /** 是否用户内容更多（每次查完满了一页才为true，此时会显示更多按钮） */
    isMoreUser: boolean = true;

    /** 置顶内容当前页 */
    topPageNum = 1;
    /** 最近内容当前页 */
    recentPageNum = 1;
    /** 热点内容当前页 */
    hotPageNum = 1;
    /** 随机内容当前页 */
    randomPageNum = 1;
    /** 用户列表当前页 */
    userPageNum = 1;

    /** 置顶内容分页大小 */
    topPageSize = 5;
    /** 最近内容分页大小 */
    recentPageSize = 24;
    /** 热点内容分页大小 */
    hotPageSize = 24;
    /** 随机内容分页大小 */
    randomPageSize = 24;
    /** 用户列表分页大小 */
    userPageSize = 32;

    /** 性别类型,-1-全部，1-男，2-女，3-未知 */
    sex: number = -1;
    /** -1-全部，1- 活跃，2-新人，3-随机*/
    type: number = -1;
    /** 性别列表 */
    sexList: any[] = [
        {id: -1, description: "全部"},
        {id: 1, description: "男生"},
        {id: 2, description: "女生"},
        {id: 3, description: "未知"},
    ];
    /** 用户类型列表 */
    typeList: any[] = [
        {key: -1, value: "全部"},
        {key: 1, value: "活跃"},
        {key: 2, value: "新人"},
        {key: 3, value: "随机"},
    ];

    constructor() {
        super();
    }

    activated() {
        ProtalIndexComponent.activated = true;
    }

    /**
     * 点击轮播图
     */
    private voteImg(item: any) {
        console.log(item);
    }

    /**
     * 查看更多置顶内容
     */
    seeMoreTop() {
        const pageNum = this.topPageNum + 1;
        this.httpRequest(TopicContentService.selectList({
            type2:1, 
            pageNum,
            pageSize: this.topPageSize
        }, '/f'), {
            success: (data: any) => {
                const topicContents = data.topicContents;
                const len = topicContents.length;
                if (len) {
                    this.topList = this.topList.concat(topicContents);
                    this.topPageNum = pageNum;
                }
                this.isMoreTop = len === this.topPageSize;
            }
        });
    }

    seeMoreRecent() {
        const pageNum = this.recentPageNum + 1;
        this.httpRequest(TopicContentService.selectList({
            type2:2, 
            pageNum,
            pageSize: this.recentPageSize
        }, '/f'), {
            success: (data: any) => {
                const topicContents = data.topicContents;
                const len = topicContents.length;
                if (len) {
                    this.recentList = this.recentList.concat(topicContents);
                    this.recentPageNum = pageNum;
                }
                this.isMoreRecent = len === this.recentPageSize;
            }
        });
    }

    /**
     * 查看更多热门内容
     */
    seeMoreHot() {
        const pageNum = this.hotPageNum + 1;
        this.httpRequest(TopicContentService.selectList({
            type2:4, 
            pageNum,
            pageSize: this.hotPageSize
        }, '/f'), {
            success: (data: any) => {
                const topicContents = data.topicContents;
                const len = topicContents.length;
                if (len) {
                    this.hotList = this.hotList.concat(topicContents);
                    this.hotPageNum = pageNum;
                }
                this.isMoreHot = len === this.hotPageSize;
            }
        });
    }

    /**
     * 查看更多随机内容
     */
    seeMoreRandom() {
        const pageNum = this.randomPageNum + 1;
        this.httpRequest(TopicContentService.selectList({
            type2:5, 
            pageNum,
            pageSize: this.randomPageSize
        }, '/f'), {
            success: (data: any) => {
                const topicContents = data.topicContents;
                const len = topicContents.length;
                if (len) {
                    this.randomList = this.randomList.concat(topicContents);
                    this.randomPageNum = pageNum;
                }
                this.isMoreRandom = len === this.randomPageSize;
            }
        });
    }

    /**
     * 查哪一页的用户
     * @param pageNum 哪一页
     */
    selectUserList(pageNum: number = 1) {
        this.httpRequest(UserService.selectList({
            sex: this.sex,
            type: this.type,
            pageNum,
            pageSize: this.userPageSize
        }, '/f'), {
            success: (data: any) => {
                const users = data.users;
                const len = users.length;
                if (len && pageNum > 1) { // 查第2页及以上
                    this.userList = this.userList.concat(users);
                    this.userPageNum = pageNum;
                } else { // 查第一页
                    this.userList = users;
                }
                this.isMoreUser = len === this.userPageSize;
            }
        });
    }

    /**
     * 查看更多用户
     */
    seeMoreUser() {
        const pageNum = this.userPageNum + 1;
        this.selectUserList(pageNum);
    }

    /**
     * 筛选符合所选性别的用户
     */
    changeSex() {
        this.userHasData = true;
        this.isMoreUser = false;
        this.selectUserList();
    }

    /**
     * 选择用户类型
     * @param type 用户类型 - -1-全部，1- 活跃，2-新人，3-随机
     */
    selectType(type: number) {
        this.type = type;
        this.userHasData = true;
        this.isMoreUser = false;
        this.selectUserList();
    }

    /**
     * 点击某个图片
     * @param item 轮播对象
     */
    vote(item: any) {
        console.log(item);
    }
}