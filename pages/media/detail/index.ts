import { Context } from '@nuxt/types';
import Component from 'vue-class-component';
import BaseComponent from '~/core/base-component';
import mediaComponent from '~/core/modules/components/commons/video/video.vue';
import defaultImg from "@/core/modules/filters/defaultImg";
@Component({
    layout:'app',
    components: {
        mediaComponent
    },
    filters:{
        defaultImg
    },
    async asyncData(context: Context) {
        const route = context.route;
        const id: any = route.query.id;

        let user = {};
        let mediaClass = {};
        let mediaContents: any = [];

        const util = BaseComponent.getSingleton();

        // 根据id查该二级分类媒体的简介和其子媒体内容（只包含简单信息）
        function getMediaContentInfo() {
            return util.httpRequest(util.http.get('/mediaClass/f/select/oneWithChildren?id='+id), {
                success: async (data: any) => {
                    user = data.user;
                    mediaClass = data.mediaClass;
                    mediaContents = data.mediaContents;
                    await util.getUserLevel(user);
                }
            },context);
        }
        await getMediaContentInfo();
        return {
            user,
            mediaClass,
            mediaContents
        }
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
    /** 媒体内容列表激活下标 */
    activeIndex: any = -1;
    ///////universal///////

    /** 播放源地址 */
    src: string = '';
    /** 获取查看前权限 */
    privilege: any = {};

    constructor() {
        super();
    }

    activated() {
        // 查询第一个要播放的媒体信息,默认第一个
        let index = 0;
        const mid = this.$route.query.mid || 0;
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
     * @param v 媒体内容（id，sid，strategy）
     * @param i 媒体列表循环下标
     */
   goPlay(v: any, i: number) {
        this.activeIndex = i;
        // 查询是否能观看
        this.getPrivilege(v, 2).then(res => {
            const pre: any = {type: res};
            if (0===res) { // 可观看
                this.getMediaContent(v.id);
            }else if (1===res){
                pre.tip = '请先登录';
                pre.text = '登录';
            } else if (2===res){
                pre.tip = '需支付云币';
                pre.text = '支付云币';
            } else if (3 === res) {
                pre.tip = '需开通会员';
                pre.text = '开通会员';
            } else if (4 === res) {
                pre.tip = '会员半价';
                pre.text = '开通会员';
            } else if (5 === res) {
                pre.tip = '需半价（会员）支付云币';
                pre.text = '支付云币（半价）';
            }
            this.privilege = pre;
        });
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

    //获取权限
    toGetPrivilege() {
        const t = this.privilege.type;
        if (1 === t) { // 提示去登录
            this.toLogin();
        } else if (2 === t) { // 全价支付云币

        } else if (3 === t || 4 === t) { // 开通会员

        } else if (5 === t) { // 半价支付云币

        }
    }
}