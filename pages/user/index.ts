import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import BaseComponent from '~/core/base-component';
import NoResultComponent from '@/core/modules/components/commons/no-result/no-result.vue';
import SidebarComponent from '@/core/modules/components/projections/sidebar/sidebar.vue';
import ButtonComponent from '@/core/modules/components/commons/form/button/button';
import InputComponent from '@/core/modules/components/commons/form/input/input';
import PartLoadingComponent from '@/core/modules/components/commons/part-loading/part-loading.vue';
import NoPrivilegeComponent from '../../components/privilege/no-privilege/index';
import PayComponent from '../../components/privilege/pay/index';
import UploadComponent from '../../core/modules/components/commons/upload/upload';
import SelectComponent from '@/core/modules/components/commons/form/select/select';
import CalendarComponent from '../../core/modules/components/commons/form/date/date';
import { ReactiveForm } from '~/core/modules/annotations';
import { Context } from '@nuxt/types';
import UserService from '../../service/user/index';
import BucketService from '~/service/bucket';

const asyncData = async (context: Context) => {
    const app = BaseComponent.getSingleton();
    app.handler.load();
    let user = {};
    let tags: any = [];
    let fansCount = 0;
    let giftRecords: any = [];
    let concernCount = 0;
    let dynamicCount = 0;
    let charmValue = 0;
    let type = 1;
    let pageNum = 1;
    let pageSize = 10;
    let list: any = [];
    let isMoreList = false;
    const id = <any>(context.route.query.id);
    await Promise.all([
        app.httpRequest(UserService.selectDetailOne({ id }, '/f'), {context}),
        app.httpRequest(UserService.selectDynamicList({ id, type, pageNum, pageSize }, '/f'), {context})
    ]).then((datas: any) => {
        const data0 = datas[0];
        const data1 = datas[1];
        // 用户详细信息
        user = data0.user || {};
        fansCount = data0.fansCount || 0;        // 粉丝数
        giftRecords = data0.giftRecords || [];    // 礼物列表
        concernCount = data0.concernCount || 0;  // 关注数
        dynamicCount = data0.dynamicCount || 0;  // 动态数
        app.getUserLevelAndDan(user);
        // 计算魅力值
        let value = 0;
        giftRecords.forEach((e: any) => {
            value += e.gift.charmValue * e.groupCount;
        })
        charmValue = value;
        // 动态列表
        const contents = data1.contents;
        list = contents;
        isMoreList = list.length === pageSize;
    });
    const o = { user, tags, fansCount, giftRecords, concernCount, dynamicCount, charmValue, list, isMoreList };
    app.setAsyncData(o);
    app.handler.unload();
    return o;
}
@Component({
    layout: 'app2',
    components: {
        NoResultComponent,
        SidebarComponent,
        ButtonComponent,
        PartLoadingComponent,
        NoPrivilegeComponent,
        PayComponent,
        UploadComponent,
        InputComponent,
        SelectComponent,
        CalendarComponent
    },
    asyncData
})
@ReactiveForm
export default class UserComponent extends BaseComponent {
    /** user页面 */
    @Ref('user_detail')
    userDetail!: any;
    /** 页面上部分用户信息 */
    @Ref('user_info')
    userInfo!: any;
    /** 用户动态条 */
    @Ref('user_bar')
    userBar!: any;
    /** 用户动态主体右侧 */
    @Ref('main_right')
    mainRight!: any;
    /** 音乐是否暂停 */
    paused: boolean = true;

    /** 路由传过来的用户id */
    id: number | any = -1;
    /** 动态类型列表原型 */
    dynamicList$ = [
        '全部',
        '圈子',
        '问答',
        '相册',
        '音乐',
        '视频'
    ];
    /** 动态类型列表克隆 */
    dynamicList: any = [];
    /** 动态激活下标 */
    activeIndex: number = 0;
    /** 用户 */
    user: any = {};
    /** 定制标签 */
    tags: any = [];
    /** 礼物列表 */
    giftRecords: any = [];
    /** 关注数 */
    concernCount: number = 0;
    /** 粉丝数 */
    fansCount: number = 0;
    /** 动态数 */
    dynamicCount: number = 0;
    /** 魅力值 */
    charmValue: number = 0;

    /** 动态列表 */
    list: any[] = [];
    /** 动态类型,默认1-全部 */
    type: number = 1;
    /** 分页-哪一页, 默认第一页 */
    pageNum: number = 1;
    /** 分页-分页大小，默认10条 */
    pageSize: number = 10;
    /** 是否在加载中 */
    isLoading: boolean = false;
    /** 是否查看更多 */
    isSeeMore: boolean = false;
    /** 是否有更多,默认有 */
    isMoreList: boolean = false;
    /** 要修改的用户的model */
    userModel: any = {}
    /** 上传头像的最大字节 */
    max: number = 1024;
    /** 上传文件的名称 */
    name: string = 'file';

    constructor() {
        super();
    }

    module(t: number) {
        switch(t) {
            case 0 : return '/circle';
            case 1 : return '/qa';
            case 4 : return '/img';
            case 5 : return '/music';
            case 6 : return '/video';
            default: return '';
        }
    }

    activated() {
        this.getAsyncDataToThisInActivated();
        this.$nextTick(() => this.pageInit());
    }

    pageInit() {
        this.id = this.$route.query.id || this.curUser.id;
        // 自己看自己时，动态列表添加‘个性化’和‘资料修改’
        // 后端也会做判断是不是自己在操作
        this.dynamicList = this.dynamicList$.slice(0);
        if (this.curUser && Number(this.id) === this.curUser.id) {
            this.dynamicList.push('修改资料');
            this.dynamicList.push('个性化');
        }
    }

    /**
     * 点击动态栏，如“全部，圈子”
     * @param i 动态栏的列表项下标
     */
    public getDynamicData(i: number): void {
        const type = i + 1;
        this.activeIndex = i;
        this.type = type;
        if (type < 7) {
            // this.type = type;
            this.pageNum = 1;
            this.isSeeMore = false;
            this.isMoreList = false;
            this.selectEntitiesByType();
        }
    }

    /**
     * 根据类型查动态
     */
    selectEntitiesByType() {
        const obj = {
            id: this.id,
            type: this.type,
            pageNum: this.pageNum,
            pageSize: this.pageSize
        };
        this.isLoading = true;
        this.httpRequest(UserService.selectDynamicList(obj, '/f'), {
            success: (data: any) => {
                this.isLoading = false;
                const list = data.contents;
                if (!this.isSeeMore) {
                    this.list = list;
                } else {
                    this.isSeeMore = false;
                    this.list = this.list.concat(list);
                    this.isMoreList = list.length === this.pageSize;
                }
            },
            error: () => {
                this.isLoading = false;
                this.isSeeMore = false;
            }
        });
    }

    /**
     * 点击查看更多
     */
    seeMore() {
        this.pageNum++;
        this.isSeeMore = true;
        this.selectEntitiesByType();
    }

    /**
     * 保存用户资料
     */
    updateUser() {
        if (this.user.sex === '') { // 没选择性别时，视为保密
            this.user.sex = 3;
        }
        const date = this.user.birthday;
        if (new Date(date).getTime() >= Date.now()) {
            this.handler.toast({ text: '日期有误，请重新选择~' });
            return;
        }
        this.handler.load();
        this.httpRequest(UserService.updateOne(this.user, '/f'), {
            success: () => {
                this.handler.unload();
                this.handler.toast({ text: '修改成功~' });
            }
        });
    }

    /** 上传头像 */
    uploadAvator(e: any) {
        this.handler.load();
        const current = e.currentTarget;
        const file = current.files[0];
        // 未选择文件
        if (!file) return;
        const param = new FormData();
        param.append('file', file);
        this.httpRequest(BucketService.updateOne(param, 'avator', '/f'), {
            success: (data: any) => {
                this.handler.unload();
                this.curUser.avator = data.url;
                if (this.user.id === this.curUser.id) { // 当前浏览的用户是自己
                    this.user.avator = data.url;
                }
            },
            error: () => {
                return true;
            }
        });
    };

    /**
     * 上传背景音乐
     */
    uploadBGM(e: any) {
        this.handler.load();
        const current = e.currentTarget;
        const file = current.files[0];
        // 未选择文件
        if (!file) return;
        const param = new FormData();
        param.append('file', file);
        this.httpRequest(BucketService.updateOne(param, 'bgm', '/f'), {
            success: (data: any) => {
                this.handler.unload();
                this.user.bgm = data.url;
            },
            error: () => {
                return true;
            }
        });
    }

    /**
     * 上传背景图片
     */
    uploadBGP(e: any) {
        this.handler.load();
        const current = e.currentTarget;
        const file = current.files[0];
        // 未选择文件
        if (!file) return;
        const param = new FormData();
        param.append('file', file);
        this.httpRequest(BucketService.updateOne(param, 'bgp', '/f'), {
            success: (data: any) => {
                this.handler.unload();
                this.user.bgp = data.url;
            },
            error: () => {
                return true;
            }
        });
    }

    /**
     * 个性化设置
     */
    personalizeSet() {
        if (!this.user.bgm && !this.user.bgp) {
            this.handler.toast({ text: '输入项不能为空~' });
            return;
        }
        this.handler.load();
        const obj = {
            bgm: this.user.bgm,
            bgp: this.user.bgp
        }
        this.httpRequest(UserService.updatePersonalizeInfo(obj, '/f'), {
            success: () => {
                this.handler.unload();
                this.handler.toast({ text: '修改成功~' });
            }
        });
    }

}