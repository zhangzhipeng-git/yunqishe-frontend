
import Component from "vue-class-component";
import { Ref } from "vue-property-decorator";
import { Tree } from "@/core/modules/components/commons/side-menu/side-menu";
import SideMenuComponent from "@/core/modules/components/commons/side-menu/side-menu.vue";
import SidebarNavComponent from "@/core/modules/components/projections/sidebar-nav/sidebar-nav.vue";
import WindowComponent from "@/core/modules/components/commons/biz-alert/_window/window.vue";
import SMSComponent from '@/core/modules/components/commons/form/sms/sms';
import SelectComponent from '@/core/modules/components/commons/form/select/select.vue';
import ButtonComponent from '@/core/modules/components/commons/form/button/button';
import BaseComponent from "@/core/base-component";
import EncryptUtil from "@/core/modules/util/encrypt-util";
@Component({
    components: {
        SideMenuComponent,
        SidebarNavComponent,
        SelectComponent,
        SMSComponent,
        ButtonComponent,
        WindowComponent
    }
})
export default class AdminComponent extends BaseComponent {
    /** 左侧菜单是否展开 */
    isShow: boolean = true;
    /** 下拉菜单是否展开 */
    isOpen: boolean = false;
    /** 操作类型 */
    operate: string = '';
    /** 弹出层标题 */
    operateTitle: string = '';
    /** 当前用户信息 */
    user: any = {};
    /** 验证类型,默认邮箱 */
    vtype: string = 'email';
    /** 性别 */
    sexList: any[] = [
        {id:-1,description:'保密'},
        {id:0,description:'男'},
        {id:1,description:'女'},
    ];
    /** 重复密码 */
    repassword: string = '';
    /** 弹出层 */
    @Ref('window')
    window!: any;
    /** 左侧菜单树 */
    tree: Tree = [
            {
                name: '首 页',
                level: 1,
                url: '/admin',
                leftIcon: ['icon-home']
            },
            {
                name: "系统管理",
                level: 1,
                spread: false,
                leftIcon: ["icon-settings"],
                rightIcon: ["icon-caret-left", "icon-caret-down"],
                child: [
                    { name: "登录设置", level: 2, leftIcon: ["icon-log-in"] },
                    { name: "验证设置", level: 2, leftIcon: ["icon-key"] },
                    { name: "操作设置", level: 2, leftIcon: ["icon-pencil-thin"] },
                    { name: "接口设置", level: 2, leftIcon: ["icon-at-sign"] }
                ]
            },
            {
                name: "用户管理",
                spread: false,
                leftIcon: ["icon-user-circle"],
                level: 1,
                rightIcon: ["icon-caret-left", "icon-caret-down"],
                child: [
                    {
                        name: "角色管理",
                        spread: false,
                        url: '/admin/user/manage-role',
                        leftIcon: ["icon-github-alt"],
                        level: 2
                    },
                    {
                        name: "权限管理",
                        spread: false,
                        url: '/admin/user/manage-power',
                        leftIcon: ["icon-shield"],
                        level: 2
                    },
                    {
                        name: "人员管理",
                        spread: false,
                        url: '/admin/user/manage-user',
                        leftIcon: ["icon-user"],
                        level: 2
                    }
                ]
            },
            {
                level: 1,
                name: "话题管理",
                spread: false,
                leftIcon: ["icon-box"],
                rightIcon: ["icon-caret-left", "icon-caret-down"],
                child: [
                    // 帖子板块和问云分类
                    {
                        level: 2,
                        name: '话题分类',
                        leftIcon: ['icon-copy'],
                        url: '/admin/topic/topic-class'
                    },
                    // 论坛帖子和问云问答
                    {
                        level: 2,
                        name: '话题列表',
                        leftIcon: ['icon-list'],
                        url: '/admin/topic/topic-content'
                    }
                ]
            },
            {
                level: 1,
                name: "资源管理",
                spread: false,
                leftIcon: ["icon-send"],
                rightIcon: ["icon-caret-left", "icon-caret-down"],
                child: [
                    {
                        level: 2,
                        name: '文档',
                        leftIcon: ['icon-book'],
                        url:'/admin/zhixing'
                    },
                    {
                        level: 2,
                        name: '视频',
                        leftIcon: ['icon-video'],
                        url:'/admin/media'
                    }
                ]
            },
            {
                level: 1,
                name: "回收站",
                leftIcon: ["icon-trash"],
                spread: false,
                rightIcon: ["icon-caret-left", "icon-caret-down"],
                child: [
                    {
                        name: "用户",
                        leftIcon: ["icon-user"],
                        level: 2
                    },
                    {
                        name: "帖子",
                        leftIcon: ["icon-send"],
                        level: 2
                    },
                    {
                        name: "问答",
                        leftIcon: ["icon-help-circle"],
                        level: 2
                    },
                    {
                        name: "文章",
                        level: 2,
                        leftIcon: ["icon-book"]
                    }
                ]
            },
            { name: "日志信息", level: 1, leftIcon: ["icon-database"] }
        ];
    /** 验证码状态 */
    SMSStatus: number = 0;

    // 获取登录后或记住我后，进入应用的用户信息
    get easyUser() {
        return this.$store.state.user || {};
    }
    constructor() {
        super();
    }

    mounted() {
        const sysMain: any = document.getElementsByClassName('wd-sys-main')[0];
        const rsize = this.$$.getcomputedStyle(<any>document.documentElement, 'fontSize');
        const bodyHeight = document.body.offsetHeight;
        sysMain.style.height = (bodyHeight - (rsize * 3)) + 'px';
    }

    public toggle(): void {
        this.isShow = !this.isShow;
        const nuxt: any = this.$refs.nuxt;
        const index = nuxt.$children[0]
        // 首页图表resize
        index && index.resize && setTimeout(() => {
            index.resize();
        }, 500);
    }

    /**
     * 打开或关闭头部右侧用户信息下拉框
     */
    showCenter() {
        this.isOpen = !this.isOpen;
        if (!this.user.id) { // 没有查用户详细信息
            this.httpRequest(this.http.get('/user/select/one?id=' + this.easyUser.id), {
                success: (data: any) => {
                    this.user = data.user;
                }
            });
        }
    }

    /**
     * 登出
     */
    logout() {
        this.httpRequest(this.http.get('/user/logout'), {
            success: () => {
                // 去后台登录页
                this.$router.push('/admin/login_for_sys');
            }
        });
    }
    /**
     * 编辑用户资料
     */
    editProfile() {
        this.operate = 'editProfile';
        this.operateTitle = '编辑用户资料';
        this.window.open();
    }
    /** 
     * 修改密码
     */
    updatePassword() {
        this.operate = 'changePassword';
        this.operateTitle = '修改密码';
        this.window.open();
    }

    /**
     * 更行管理信息
     */
    async updateUser() {
        if (this.operate === 'changePassword') {
            this.user.password = await EncryptUtil.MD5(this.user.password);
        }
        this.httpRequest(this.http.post('/user/b/update/one', this.user), {
            success: () => {
                this.isOpen = false;
                this.user.id = null; // 再次打开下拉时会重查用户信息
                this.window.close();
                this.handler.toast({ text: '修改成功' });
            },
            error: (data: any) => {
                this.SMSStatus = data.status;
                return true;
            }
        });
    }

    /**
     * 发送验证码
     */
    sendSMS() {
        this.httpRequest(this.http.post('/user/sendcode', this.user.email), {
            success: () => {
                this.handler.toast({ text: '验证码已发送' });
            }
        });
    }

    /**
     * 关闭弹窗
     */
    close() {
        this.window.close();
    }

    /**
     * 确认并关闭弹窗
     */
    confirm() {
        this.window.close();
        this.updateUser();
    }
}