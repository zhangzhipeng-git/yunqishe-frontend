/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\pages\media\detail\index.ts
 * Created Date: Saturday, April 18th 2020, 4:50:15 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 
 * Last Modified: Monday May 4th 2020 2:20:30 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

import { Context } from '@nuxt/types';
import Component from 'vue-class-component';
import BaseComponent from '~/core/base-component';
import VideoComponent from '~/core/modules/components/commons/video/video.vue';
import defaultImg from "@/core/modules/filters/defaultImg";
import PayComponent from '~/components/privilege/pay/index';
import NoPrivilegeComponent from '~/components/privilege/no-privilege/index';

@Component({
    layout:'app',
    components: {
        VideoComponent,
        PayComponent,
        NoPrivilegeComponent
    },
    filters:{
        defaultImg
    },
    async asyncData(context: Context) {
        const route = context.route;
        /** 媒体内容父id - 即二级分类id */
        const id: any = route.query.id;
        let user = {};
        let mediaClass = {};
        let mediaContents: any = [];
        const util = BaseComponent.getSingleton();
        // 根据id查该二级分类媒体的简介和其子媒体内容（只包含简单信息）
        await util.httpRequest(util.http.get('/mediaClass/f/select/oneWithChildren?id='+id), {
            success: async (data: any) => {
                user = data.user;
                mediaClass = data.mediaClass;
                mediaContents = data.mediaContents;
                await util.getUserLevel(user);
            }
        },context);
        const o =  {
            user,
            mediaClass,
            mediaContents
        };
       util.setAsyncData(o);
       return o;
    }
})
export default class mediaPageComponent extends BaseComponent {
    ///////universal///////
    /** 媒体发表者 */
    user!: any;
    /** 媒体父类 */
    mediaClass!: any;
    /** 媒体内容列表 */
    mediaContents!: any;
    ///////universal///////
    
    /** 媒体内容列表激活下标 */
    activeIndex: any = -1;
    /** 播放源地址 */
    src: string = '';

    /** 获取选择的内容 */
    get selectContent() {
        return this.mediaContents[this.activeIndex]||{};
    }

    constructor() {
        super();
    }

    activated() {
        this.setAsyncDataToThisInActivated();
        /** 查询第一个要播放的媒体信息,默认第一个 */
        let index = 0;
        /** 媒体内容id */
        const mid = Number(this.$route.query.mid);
        const mediaContents = this.mediaContents;
        let firstPlay = mediaContents[0];
        for(let i = 0, len = mediaContents.length; i < len; i++) {
            if (mediaContents[i].id === mid) {
                index = i;
                firstPlay = mediaContents[i];
                break;
            }
        }
        this.goPlay(firstPlay, index);
    }


    /**
     * 点击第几集进行播放
     * @param v 媒体内容（id，sid，strategy,privilegeType）
     * @param i 媒体列表循环下标
     */
    goPlay(v: any, i: number) {
        this.activeIndex = i;
        this.getMediaContent(v.id)
    }

    /**
     * 根据媒体id查url
     * @param vid 媒体id
     */
    getMediaContent(vid: number) {
        this.httpRequest(this.http.get('/mediaContent/f/select/one?id='+vid), {
            success: (data: any) => {
                this.src = data.mediaContent.url;
            }
        });
    }
}