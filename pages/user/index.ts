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
@Component({layout: 'app2',components: {
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
}})
export default class UserComponent extends BaseComponent {
    activeIndex: number = 0;
    /** user页面 */
    @Ref('user_detail')
    userDetail!:any;
    /** 页面上部分用户信息 */
    @Ref('user_info')
    userInfo!:any;
    /** 用户动态条 */
    @Ref('user_bar')
    userBar!:any;
    /** 用户动态主体左侧 */
    @Ref('main_right')
    mainRight!:any;

    /** 路由传过来的用户id */
    id: number|any = -1;
    /** 动态类型列表 */
    dynamicList = [
        '全部',
        '圈子',
        '问答',
        '相册',
        '音乐',
        '视频'
    ];

    /** 用户 */
    user: any = {};
    /** 用户副本 */
    user$: any = {};
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
    /** 分页-哪一页 */
    pageNum: number = 1;
    /** 分页-分页大小 */
    pageSize: number = 10;

    /** 是否在加载, 默认在加载 */
    isLoading: boolean = true;
    /** 是否查询过动态列表 */
    hasQuery: boolean = false;

    /** 是否有更多,默认有 */
    noMore:boolean = false;

    /** 要修改的用户的model */
    userModel: any = {}

    /** 上传头像的最大字节 */
    max: number = 1024;
    /** 上传文件的名称 */
    name: string = 'file';

    constructor() {
        super();
    }

    public async mounted(){
        this.id = this.$route.query.id||this.curUser.id;
        // 自己看自己时，动态列表添加‘个性化’和‘资料修改’
        // 后端也会做判断是不是自己在操作
        if (null === this.curUser) {
            await this.isRecord();
        }
        if (this.curUser && Number(this.id) === this.curUser.id){
            this.dynamicList.push('修改资料');
            this.dynamicList.push('个性化');
        }
        this.getUserInfo();
        this.selectEntitiesByType(this.type);
        this.user$ = this.clone(this.curUser);
    }

    /**
     * 根据用户id查用户信息
     * @param id 用户id
     */
    getUserInfo() {
        this.httpRequest(this.http.get('/user/f/select/detail/one?id='+this.id), {
            success: (data: any) => {
                this.user = data.user;
                this.tags = data.tags;
                this.fansCount = data.fansCount;
                this.giftRecords = data.giftRecords;
                this.concernCount = data.concernCount;
                this.dynamicCount = data.dynamicCount;

                this.getUserLevelAndDan(this.user);
                // 计算魅力值
                let value = 0;
                this.giftRecords.forEach((e: any) => {
                    value += e.gift.charmValue*e.groupCount;
                })
                this.charmValue = value;
                this.setHeight();
            },
            error: () => {
                this.setHeight();
                return true;
            }
        });
    }

    /**
     * 点击动态栏，如“全部，帖子”
     * @param i 动态栏的列表项下标
     */
    public getDynamicData(i: number): void {
        const type = i+1;
        this.activeIndex = i;
        if (type < 7){
            // this.type = type;
            this.pageNum = 1;
            this.noMore = false;
            this.selectEntitiesByType(type);
            return;
        }
        // 个性化和修改资料
        this.type = type;
    }

    /**
     * 根据类型查动态
     */
    selectEntitiesByType(type: number) {
        this.isLoading=true;
        this.httpRequest(this.http.get('/user/f/select/dynamic/list?type='
        + type+'&id='+this.id+'&pageNum='+this.pageNum+'&pageSize='+this.pageSize), {
            success: (data: any) => {
                if (this.type !== type) { // 不同类型置空
                    this.list = [];
                    this.type = type;
                }
                // 相同类型连接
                this.list = this.list.concat(data.contents);
                this.isLoading = false;
                this.hasQuery = true;
                this.setHeight();
                if(!data.contents.length) {
                    this.noMore = true;
                }
            }
        });
    }

    /**
     * 点击查看更多
     */
    seeMore() {
        if (this.noMore) return;
        this.pageNum++;
        this.selectEntitiesByType(this.type);
    }

    /**
     * 查看动态详情
     */
    toDynamicDetail(v: any) {
        const id = v.id;
        const pid = v.pid;
        const type = v.type;
        // 查父分类后去详情页
        if (type === 0 || type === 1) { // 查话题分类后去话题详情页
            const key = type === 0 ? 'circle' : 'qa';
            this.httpRequest(this.http.get('/topicClass/f/select/one?&id='+pid), {
                success: (data: any) => {
                    this.localStorage.setItem('topic-'+key, data.topicClass);
                    this.$router.push('/'+key+'/detail?id='+id);
                }
            });
        } else if (type >= 4 && type <= 6) { // 查媒体分类后去媒体详情页
            const key = type === 4 ? 'img' : type === 5? 'music' : 'video';
            this.httpRequest(this.http.get('/mediaClass/f/select/one?id='+pid), {
                success: (data: any) => {
                    this.localStorage.setItem('media-'+key, data.mediaClass);
                    this.$router.push('/media/detail?id='+pid+'&mid='+id); // 这里媒体用pid传过去
                }
            });
        }
    }


    /**
     * 异步查询后，主体高度变化
     */
    public setHeight() {
        this.mainRight.style.height = 'auto'; // 异步查询后，自动设置一下高度
        this.$nextTick(() => {
            // 页面下边儿动态列表补满一屏
            const userDetailHeight = this.userDetail.scrollHeight;
            const userInfoHeight = this.userInfo.offsetHeight;
            const userBarHeight = this.userBar.offsetHeight;
            const rsize = parseFloat(this.$$.getcomputedStyle(document.body, 'fontSize'));
            this.mainRight.style.height = (userDetailHeight - userInfoHeight - userBarHeight - (5+3+.5)*rsize) + 'px';
        })
    }

    /** 选择头像 */
    onchange(e: any) {
        this.handler.load();
        const file = e.currentTarget.files[0];
        // 未选择文件
        if (!file) return;
        const param = new FormData();
        param.append('file', file);
        const config = {
            headers:{"Content-Type": "multipart/form-data"},
            // 监听进度，这里不需要
            // onUploadProgress: e => {
            // var completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
            //     this.progress = completeProgress;
            // }
        };
        this.httpRequest(this.http.$post('/upload/user/avator',param, {config}), {
            success: (data: any) => {
                this.handler.unload();
                this.curUser.avator = data.url;
                if (this.user.id === this.curUser.id) { // 当前浏览的用户是自己
                    this.user.avator = data.url;
                }
            }
        });
    };

    /**
     * 保存用户资料
     */
    updateUser() {
        
    }

}