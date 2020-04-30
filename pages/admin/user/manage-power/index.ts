/*
* @Author: your name
* @Date: 2020-02-12 22:34:23
* @LastEditTime: 2020-03-07 21:39:34
* @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: \nuxt-ssr\pages\admin\user\manage-power\index.ts
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
export default class ManagePowerComponent extends BaseComponent {
    powers: any[] = [];
    @Ref('iu_power')
    window!: any;
    // 选中的权限
    power: any = {};
    // title
    title: string = '';
    // 弹窗时默认操作更新
    operate: string = '';
    constructor() {
        super();
    }
    /** 选中的行 */
    rows: any = [];
    /** 选中的行id */
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

    /**
     * 请求权限
     */
    activated() {
        this.selectPowerList();
    }
    /**
     * 查询权限列表和简单权限列表
     */
    selectPowerList() {
        this.handler.load();
        this.httpRequest(this.http.get("/power/select/list"), {
            success: (data: any) => {
                // 获取权限（完整列表）
                this.powers = data.powers;
                this.handler.unload();
            }
        });
    }
    insert$() {
        this.operate = 'insert';
        this.title = '添加权限';
        this.power = {};
        this.window.open();
    }
    insertOne({ row }: any) {
        this.operate = 'insertchild';
        this.title = '添加子权限';
        this.power = { name: '', description: '', pid: row.pid };
        this.window.open();
    }

    /** 单个删除或批量删除 */
    delete$() {
        if (!this.ids.length) return;
        this.httpRequest(this.http.post('/power/delete', this.ids), {
            success: (data: any) => {
                this.selectPowerList();
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
        // 根据id查询权限
        this.httpRequest(this.http.get('/power/select?id=' + this.ids[0]), {
            success: (data: any) => {
                this.power = data.power;
                this.ids = [];
            }
        });
        this.title = '修改权限';
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
     * 弹窗确认接受发射的power
     * @param power power实体
     */
    insertOrUpdate(power: any) {
        const url = '/power/' + (power.id ? 'update' : 'insert');
        // 修改或删除
        this.httpRequest(this.http.post(url, power), {
            success: (data: any) => {
                this.selectPowerList();
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
        this.insertOrUpdate(this.power);
    }
}
