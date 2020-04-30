/*
* @Author: your name
* @Date: 2020-02-12 22:34:23
* @LastEditTime: 2020-03-07 21:50:49
* @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: \nuxt-ssr\pages\admin\user\manage-role\index.ts
*/
import Component from "vue-class-component";
import BaseComponent from "~/core/base-component";
import TableComponent from "@/core/modules/components/commons/table/table.vue";
import ButtonComponent from "@/core/modules/components/commons/form/button/button.vue";
import WindowComponent from '@/core/modules/components/commons/biz-alert/_window/window.vue';
import SelectComponent from '@/core/modules/components/commons/form/select/select.vue';
import TreeComponent from '@/core/modules/components/commons/form/tree/tree.vue';
import { Ref } from "vue-property-decorator";
@Component({
    layout: 'admin', components: {
        TableComponent,
        ButtonComponent,
        WindowComponent,
        SelectComponent,
        TreeComponent
    }
})
export default class ManageRoleComponent extends BaseComponent {
    @Ref('iu_role')
    window!: any;
    // 角色列表key-value
    roles: any[] = [];
    // 权限列表key-value
    powers: [] = [];
    // 选中的角色
    role: any = { pid: null, powers: null };
    // title
    title: string = '';
    /** 操作名 'insertchild'时，不需要设置父角色 */
    operate: string = '';
    /** 选中的行 */
    rows: any = [];
    /** 选中的行下标 */
    get ids() {
        if (this.rows.length) {
            return this.rows.map((row: any) => {
                return row.id;
            });
        }
        return [];
    }
    set ids(v: any[]) {
        this.rows = v.map((e: any) => {
            return { id: e };
        });
    }
    get powerIDs() {
        if (!this.role.powers) return [];
        return this.role.powers.map((e: any) => {
            return e.id;
        });
    }

    set powerIDs(v: any) {
        this.role.powers = v.map((id: number) => {
            return { id };
        });
    }
    constructor() {
        super();
    }

    /**
     * 请求角色和简单权限列表
     */
    activated() {
        this.selectRoles();
        this.selectSimplePowers();
    }
    /**
     * 查询简单权限列表
     */
    selectSimplePowers() {
        this.httpRequest(this.http.get('/power/select/simple/list'), {
            success: (data: any) => {
                // 获取权限（只有key和value）
                this.powers = data.simplePowers;
            }
        });
    }
    /**
     * 查询角色列表
     */
    selectRoles() {
        this.handler.load();
        this.httpRequest(this.http.get("/role/select/list"), {
            success: (data: any) => {
                // 获取角色（完整列表）
                this.roles = data.roles;
                this.handler.unload();
            }
        });
    }

    insert$() {
        this.operate = 'insert';
        this.title = '添加角色';
        this.role = { name: '', description: '', pid: null, powers: null };
        this.window.open();
    }

    insertOne({ row }: any) {
        this.operate = 'insertchild';
        this.title = '添加子角色';
        this.role = { name: '', description: '', pid: row.pid, powers: null };
        this.window.open();
    }
    /** 单个删除或批量删除 */
    delete$() {
        if (!this.ids.length) return;
        this.httpRequest(this.http.post('/role/delete', this.ids), {
            success: (data: any) => {
                this.selectRoles();
                this.handler.toast({
                    text: data.tip
                })
                this.ids = [];
            }
        });
    }

    /**
     * 点击表格上方操作条的编辑按钮
     */
    select$() {
        if (!this.ids.length || this.ids.length > 1) return;
        // 根据id查询角色
        this.httpRequest(this.http.get('/role/select?id=' + this.ids[0]), {
            success: (data: any) => {
                this.role = data.role;
                this.ids = [];
            }
        });
        this.title = '修改角色';
        this.operate = 'update';
        this.window.open();
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
     * 弹窗确认接受发射的role
     * @param role role实体
     */
    insertOrUpdate(role: any) {
        const url = '/role/' + (role.id ? 'update' : 'insert');
        // 修改或删除
        this.httpRequest(this.http.post(url, role), {
            success: (data: any) => {
                this.selectRoles();
                this.window.close();
                this.handler.toast({
                    text: data.tip
                });
                this.ids = [];
            }
        });
    }
    /** 关闭弹窗 */
    close() {
        this.window.close();
    }
    /** 确认并关闭弹窗 */
    confirm() {
        this.window.close();
        this.insertOrUpdate(this.role);
    }
}
