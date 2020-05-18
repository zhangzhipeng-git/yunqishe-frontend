/*
* Project: nuxt-ssr
* FileName: index.ts
* Author: zzp-dog
* File Created: Friday, 1st May 2020 1:19:06 pm
* description: 云币参数列表配置
* Last Modified: Friday, 1st May 2020 1:20:17 pm
* Modified By: zzp-dog
* Copyright © zzp-dog, All rights reserved.
*/

import Component from 'vue-class-component';
import BaseComponent from '~/core/base-component';
import TableComponent from '@/core/modules/components/commons/table/table';
import SelectComponent from '@/core/modules/components/commons/form/select/select';
import ButtonComponent from '@/core/modules/components/commons/form/button/button';
import { Ref } from 'vue-property-decorator';

@Component({
    layout:'admin',
    components: {
        TableComponent,
        ButtonComponent,
        SelectComponent
    }
})
export default class ArgComponent extends BaseComponent {
    
    /** 云币兑换类型列表 */
    list: any[] = [];
    /** 选中的列表的行实体集合 */
    rows: any[] = [];
    /** table列表引用 */
    @Ref('table')
    table!: any;
    /** 获取table组件中复制本组件传入的list */
    get tableList() {
        return this.table.list$;;
    }
    /** 选中的行下标 */
    get ids() {
        if(this.rows.length) {
            return this.rows.map((row: any) => {
                return row.id;
            });
        }
        return [];
    } 
    /** 设置选中的行下标 */
    set ids(v: any[]) {
        if(!v) this.rows = [];
        this.rows = v.map((e: any) => {
            return {id: e};
        });
    }

    constructor() {
        super();
    }

    activated() {
        this.selectList();   
    }

    /**
     * 查询云币兑换相关参数配置列表
     */
    selectList() {
        this.httpRequest(this.http.get('/exchangeArg/u/select/list'), {
            success: (data: any) => {
                this.list = data.exchangeArgs;
            }
        });
        this.ids = [];
        this.rows = [];
    }

    /**
     * 单一插入
     */
    insert$() {
        this.tableList.push({});
        this.list = this.tableList;
    }

    /**
     * 单一或批量删除
     */
    delete$() {
        // 无id的行，游离态
        const noid = this.rows.filter((row: any)=> {
            return !row.id&&row.id !== 0; // 假设数据库存在id为0的数据
        }) ;
        // 有id的行，持久态
        const hasid = this.rows.filter((row: any) => {
            return !!row.id||row.id === 0;
        });
        for(let i = 0, len = noid.length; i < len; i++){
            const index = noid[i].$index;
            for(let j = 0; j < this.tableList.length; j++) {
                if(index === this.tableList[j].$index){
                    this.tableList.splice(j,1);
                    ++j;
                }
            }
        }
        this.rows = hasid;
        this.list = this.tableList;
        this.delete();
    }

    /**
     * 批量保存
     */
    batchUpdate$() {
        this.insertOrUpdate();
    }

    /**
     * 选择支付方式
     */
    searchType$(type: number) {
        // this.searchType = type;
        this.selectList();
    }

    /**
     * 更新某行
     */
    updateOne({row}: any) {
        this.rows = [row];
        this.insertOrUpdate();
    }

    /**
     * 删除某行
     */
    deleteOne({row,index}: any) {
        if(!row.id&&row.id!==0) { // 删除无id的行
            this.tableList.splice(index,1);
            this.list = this.tableList;
            return;
        }
        this.rows = [row];
        this.delete();
    }

    /**
     * 单一或批量删除
     */
    delete() {
        if(!this.ids.length) return;
        this.httpRequest(this.http.post('/exchangeArg/b/batch/delete',this.ids),{
            success: (data: any) => {
                this.handler.toast({
                    text:data.tip
                });
                this.selectList();
            }
        });
    }

    /**
     * 单个或批量更新或插入
     */
    insertOrUpdate() {
        if(!this.rows.length)return;
        this.httpRequest(this.http.post('/exchangeArg/b/batch/insertOrUpdate',this.rows),{
            success: (data: any) => {
                this.handler.toast({text:data.tip});
                this.selectList();
            }
        })
    }
}