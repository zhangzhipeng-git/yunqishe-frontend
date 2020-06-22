/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\pages\admin\email\template\index.ts
 * Created Date: Saturday, June 20th 2020, 4:51:37 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 
 * Last Modified: Saturday June 20th 2020 5:04:12 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

import Component from 'vue-class-component';
import BaseComponent from '~/core/base-component';
import strCut from '~/core/modules/filters/strCut';
import TableComponent from '@/core/modules/components/commons/table/table';
import ButtonComponent from '@/core/modules/components/commons/form/button/button';
import WindowComponent from '@/core/modules/components/commons/biz-alert/_window/window.vue';
import SwitchComponent from '../../../../core/modules/components/commons/form/switch/switch';
import EditorComponent from '@/core/modules/components/commons/editor/editor.vue';
import { Ref } from 'vue-property-decorator';
@Component({
    layout: 'admin',
    filters: {
        strCut
    },
    components: {
        TableComponent,
        WindowComponent,
        ButtonComponent,
        EditorComponent,
        SwitchComponent
    }
})
export default class ListComponent extends BaseComponent {
    /** 操作, 默认更新操作 */
    operate: string = 'update';
    /** 操作标题 */
    operateTitle: string = '';
    /** 邮件消息模板列表 */
    emailTemplates: any[] = [];
    /** 某个邮件消息模板 */
    emailTemplate: any = {};
    /** 窗体 */
    @Ref('window')
    window!: any;
    /** 选中的行 */
    rows: any[] = [];

    constructor() {
        super();
    }

    async activated() {
        this.handler.load();
        await this.selectList();
        this.handler.unload();
    }

    /**
     * 查询消息模板
     */
    selectList() {
        return this.httpRequest(this.http.get('/emailTemplate/b/select/list'), {
            success: (data: any) => {
                // 获取消息模板列表
                data.emailTemplates.forEach((et: any) => {
                    let typeDesc = '';
                    switch(et.type) {
                        case 1: typeDesc = '验证码';break;
                    }
                    et['typepDesc'] = typeDesc;
                });
                this.emailTemplates = data.emailTemplates;
            }
        });
    }

    /**
     * 点击上方curd-bar操作条的编辑按钮
     */
    select$() {
        if (this.rows.length !== 1) return;
        this.selectOne({ row: this.rows[0] });
        this.rows = [];
    }

    /**
     * 点击保存按钮
     * 批量更新选中行
     */
    update$() {
        if (!this.rows.length) return;
        this.operate = 'update';
        this.insertOrUpdate(this.rows);
    }

    /**
     * 点击上方curd-bar操作条的删除按钮
     */
    delete$() {
        const ids = this.rows.map((row: any) => {
            return row.id;
        });
        this.delete(ids);
    }

    /**
     * 
     * @param {{row}} 编辑的某行
     */
    selectOne({ row }: any) {
        this.operate = 'select';
        this.operateTitle = '编辑消息模板';
        this.httpRequest(this.http.get('/emailTemplate/b/select/one?id=' + row.id), {
            success: (data: any) => {
                this.emailTemplate = data.emailTemplate;
                this.fixEditorBug();
                this.window.open();
            }
        });
    }

    /**
     * 点击行删除按钮
     * @param {{row}} 删除某行
     */
    deleteOne({ row }: any) {
        this.delete([row.id]);
    }

    /**
     * 添加或修改消息模板
     * 单个插入，单个或批量更新
     */
    insertOrUpdate(emailTemplate: any | any[]) {
        emailTemplate = emailTemplate.length ? emailTemplate : [emailTemplate];
        this.httpRequest(this.http.post('/emailTemplate/b/batch/update', emailTemplate), {
            success: (data: any) => {
                this.window.close();
                this.handler.toast({ text: data.tip });
                this.selectList();
                this.rows = [];
            }
        })
    }

    /**
     *根据id数组单个或批量删除
     */
    delete(ids: number[]) {
        this.httpRequest(this.http.post('/emailTemplate/batch/delete', ids), {
            success: (data: any) => {
                this.selectList();
                this.handler.toast({ text: data.tip });
                this.rows = [];
            }
        });
    }

    fixEditorBug() {
        const o = this.emailTemplate;
        this.emailTemplate = {};
        setTimeout(() => { this.emailTemplate = o });
    }

    /** 关闭弹窗 */
    close() {
        this.window.close();
    }

    /** 确认并关闭弹窗 */
    confirm() {
        this.window.close();
        this.insertOrUpdate(this.emailTemplate);
    }

}