/*
* @Author: your name
* @Date: 2020-02-12 22:34:23
* @LastEditTime: 2020-03-07 21:59:10
* @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: \nuxt-ssr\pages\admin\user\manage-user\index.ts
*/
import Component from "vue-class-component";
import BaseComponent from "~/core/base-component";
import SelectComponent from '@/core/modules/components/commons/form/select/select.vue';
import TableComponent from "@/core/modules/components/commons/table/table.vue";
import PageBarComponent from "@/core/modules/components/commons/page-bar/page-bar.vue";
import { PageInfo } from "@/core/modules/components/commons/page-bar/page-bar";
import TreeComponent from '@/core/modules/components/commons/form/tree/tree.vue';
import RadioGroupComponent from '@/core/modules/components/commons/form/radio-group/radio-group';
import ButtonComponent from "@/core/modules/components/commons/form/button/button.vue";
import WindowComponent from '@/core/modules/components/commons/biz-alert/_window/window.vue';
import EncryptUtil from '@/core/modules/util/encrypt-util.ts';
import { Ref } from "vue-property-decorator";
@Component({
    layout: 'admin', components: {
        TableComponent,
        ButtonComponent,
        WindowComponent,
        SelectComponent,
        RadioGroupComponent,
        TreeComponent,
        PageBarComponent
    }
})
export default class ManageUserComponent extends BaseComponent {
    /** 用户列表 */
    users: any[] = [];
    /** 弹窗 */
    @Ref('iu_user')
    window!: { close: Function, open: Function };
    /** 选中的用户 */
    user: any = {};
    /** title */
    title: string = '';
    /** 弹窗时默认操作更新 */
    operate: string = '';
    /** 用户状态列表 */
    statusList: any[] = [
        { id: 0, description: '未激活' },
        { id: 1, description: '正常' },
        { id: 2, description: '禁封' },
        { id: 3, description: '风险' },
        { id: 4, description: '内置' },
    ];
    /** 搜索状态 */
    searchStatus = ''
    /** 用户状态列表 */
    sexList: any[] = [
        { id: -1, description: '未知' },
        { id: 0, description: '男' },
        { id: 1, description: '女' },
    ];
    /** 搜索性别 */
    searchSex = ''
    /** 搜索角色 */
    searchRole = '';
    /** 搜索姓名 */
    searchName = '';
    /** 搜索昵称 */
    searchNickname = '';
    /** 角色列表 */
    roles: any[] = [];
    /** 分页信息 */
    pageInfo: PageInfo = {
    };
    /** 非响应式 */
    pageQueryStr!: string;
    filterQueryStr!: string;
    /** 要更新的user，兼容批量或单个更新，用数组包裹上传  */
    users$: any = [];
    /** 选中的行下标 */
    get ids() {
        if (this.users$.length) {
            return this.users$.map((row: any) => {
                return row.id;
            });
        }
        return [];
    }
    set ids(v: any[]) {
        if (!v) this.users$ = [];
        this.users$ = v.map((e: any) => {
            return { id: e };
        });
    }
    get roleIDs(): number[] {
        if (!this.user.roles) {
            return [];
        }
        return this.user.roles.map((r: any) => {
            return r.id;
        });
    }
    /**
     * 非内置用户（status!==4），只能更新时只更新角色和状态
     */
    get disabled() {
        return this.operate === 'update' && this.user.status !== 4;
    }

    set roleIDs(v: number[]) {
        this.user.roles = v.map((id: any) => {
            return { id };
        })
    }

    constructor() {
        super();
    }

    /**
     * 请求用户列表
     */
    activated() {
        this.selectUserList();
        this.selectRoleList();
    }

    /**
     * 去那一页或改变每页大小
     * @param o 
     */
    toPage(o: any) {
        this.ids = [];
        this.pageQueryStr = o.queryStr;
        this.selectUserList();
    }

    /**
     * 搜索
     */
    search$() {
        let arr: any = [];
        const name = this.searchName;
        const nickname = this.searchNickname;
        const sex = this.searchSex;
        const status = this.searchStatus;
        const roleId = this.searchRole;
        if (name) {
            arr.push('name=' + name);
        }
        if (nickname) {
            arr.push('nickname=' + nickname);
        }
        if (sex) {
            arr.push('sex=' + sex);
        }
        if (status) {
            arr.push('status=' + status);
        }
        if (roleId) {
            arr.push('roleId=' + roleId);
        }
        this.filterQueryStr = arr.join('&');
        console.log(this.filterQueryStr)
        this.selectUserList();
    }
    /**
     * 获取角色列表
     */
    selectRoleList() {
        this.httpRequest(this.http.get('/role/select/list'), {
            success: (data: any) => {
                this.roles = data.roles;
            }
        })
    }
    /**
     * 查询用户列表和简单用户列表
     */
    selectUserList() {
        this.handler.load();
        let arr: any = [];
        if (this.filterQueryStr) {
            arr.push(this.filterQueryStr);
        }
        if (this.pageQueryStr) {
            arr.push(this.pageQueryStr);
        }
        const qstr = '?' + arr.join('&');
        this.httpRequest(this.http.get("/user/select/list" + qstr), {
            success: (data: any) => {
                const pageInfo = data.pageInfo;
                // 获取用户（完整列表）
                this.users = pageInfo.list;
                const o: any = {};
                o.pages = pageInfo.pages;
                o.total = pageInfo.total;
                o.pageNum = pageInfo.pageNum;
                o.pageSize = pageInfo.pageSize;
                o.navPages = 5;
                o.pageSizes = [10, 20, 30, 40, 50];
                o.jump = true;
                o.detail = true;
                this.pageInfo = o;
                this.handler.unload();
            }
        });
    }

    /**
     * 点击列表单行删除
     * @param  {any} {row}
     */
    deleteOne({ row }: any) {
        this.ids = [row.id];
        this.delete$();
    }


    /**
     * 点击行的编辑
     * @param  {any} {row}
     */
    selectOne({ row }: any) {
        this.ids = [row.id];
        this.select$();
    }

    /**
     * 插入新的用户
     */
    insert$() {
        this.operate = 'insert';
        this.title = '添加用户';
        this.user = { roles: [] };
        this.window.open();
    }

    /**
     * 点击编辑前，根据id查实体信息
     */
    select$() {
        if (!this.ids.length || this.ids.length > 1) return;
        // 根据id查询用户
        this.httpRequest(this.http.get('/user/select/one?id=' + this.ids[0]), {
            success: (data: any) => {
                this.user = data.user;
                this.ids = [];
                this.users$ = null;
            }
        });
        this.title = '修改用户';
        this.operate = 'update';
        this.window.open();
    }

    /**
     * 单个删除或批量删除到回收站
     */
    delete$() {
        if (!this.ids.length) return;
        this.httpRequest(this.http.post('/user/batch/trash', this.ids), {
            success: (data: any) => {
                this.selectUserList();
                this.handler.toast({
                    text: data.tip
                })
                this.ids = [];
                this.users$ = null;
            }
        });
    }

    /**
     * 点击保存按钮，批量修改
     */
    batchUpdate$() {
        this.operate = 'update';
        if (!this.users$ || !this.users$.length) return;
        this.insertOrUpdate(this.users$);
    }

    /**
     * 弹窗确认接受发射的user
     * @param user user实体
     */
    async insertOrUpdate(user: any | any[]) {
        // 单个插入，单个或批量更新
        const update = this.operate === 'update';
        const url = '/user/' + (update ? 'batch/update' : 'insert');
        // 修改或删除
        if (!update && user.password) {
            const pass = user.password;
            // 取消响应式
            this.$delete(user, 'password');
            user.password = await EncryptUtil.MD5(pass);
        }
        // 这里更新时，user为用户数组，插入时，user为单个用户
        this.httpRequest(this.http.post(url, user), {
            success: (data: any) => {
                this.selectUserList();
                this.window.close();
                this.handler.toast({
                    text: data.tip
                });
                // 成功后，取消选中
                this.ids = [];
                // 成功后，重置要批量修改的用户
                this.users$ = null;
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
        this.insertOrUpdate(this.user);
    }
}
