/*
* @Author: your name
* @Date: 2020-03-01 10:36:26
 * @LastEditTime: 2020-03-08 20:50:34
 * @LastEditors: Please set LastEditors
* @Description: 帖子分类
* @FilePath: \nuxt-ssr\pages\admin\content\invitation\classify\index.ts
*/
import Component from 'vue-class-component';
import SelectComponent from '@/core/modules/components/commons/form/select/select.vue';
import TableComponent from '@/core/modules/components/commons/table/table';
import ButtonComponent from '@/core/modules/components/commons/form/button/button';
import BaseComponent from '~/core/base-component';
import { Ref } from 'vue-property-decorator';

@Component({layout:'sys',components:{ButtonComponent,TableComponent,SelectComponent}})
export default class TopicClassifyComponent extends BaseComponent {
    /** 分类列表 */
    classify: any[] = [];
    /** 发射的批量行数据 */
    rows: any[] = [];
    /** 是和否 */
    list: any[] = [
        {id:0,description:'否'},{id:1,description:'是'}
    ];
    /** 按模块搜索分类，默认论坛 */
    searchModule:number = 0;
    /** 所属模块0-论坛，1-问云 */
    modules: any[] = [
        {id: 0, description: '论坛'},
        {id: 1, description: '问云'}
    ];
    @Ref('table')
    table!: TableComponent;
    /** 借助直接获取子组件的值的方式修改子组件！！！ */
    get tableList() {
        return this.table.list$;
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
    set ids(v: any[]) {
        if(!v) this.rows = [];
        this.rows = v.map((e: any) => {
            return {id: e};
        });
    }

    constructor() {
        super();
    }

    /**
     * 搜索模块
     * @param searchModule 模块类型 0-非问题型，1-问题型
     */
    searchModule$(searchModule: number) {
        this.searchModule = searchModule;
        this.selectClassifyList();
    }

    activated() {
        this.selectClassifyList();    
    }
    /**
     * 查询分类
     */
    selectClassifyList() {
        this.httpRequest(this.http.get('/topic/select/list?type='+this.searchModule),{
            success: (data: any) => {
                this.classify = data.topics;
            }
        });
        this.rows = [];
    }
    /**
     * 添加行
     */
    insert$() {
        this.tableList.push({});
        this.classify = this.tableList;
    }
    /**
     * 删除无id的行和有id的数据
     */
    delete$() {
        // 无id的行，游离态
        const noid = this.rows.filter((row: any)=> {
            return !row.id&&row.id !== 0;
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
        this.classify = this.tableList;
        this.delete();
    }
    
    /**
     * 单个或批量 更新或插入
     */
    batchUpdate$() {
        this.insertOrUpdate();
    }

    /**
     * 点击列表单行删除
     * @param  {any} {index}
     */
    deleteOne({row, index}: any) {
        if(!row.id&&row.id!==0) { // 删除无id的行
            this.tableList.splice(index,1);
            this.classify = this.tableList;
            return;
        }
        this.rows = [row];
        this.delete();
    }
    
    /**
     * 点击行的保存,可能是插入和更新
     * @param  {any} {row}
     */
    updateOne({row}: any) {
        this.rows = [row];
        this.insertOrUpdate();
    }

    /**
     * 单个或批量删除
     */
    delete() {
        if(!this.ids.length) return;
        this.httpRequest(this.http.post('/topic/batch/delete',this.ids),{
            success: (data: any) => {
                this.handler.toast({
                    text:data.tip
                });
                this.selectClassifyList();
                this.rows = [];
            }
        });
    }

    /**
     * 单个或批量更新或插入
     */
    insertOrUpdate() {
        if(!this.rows.length)return;
        this.httpRequest(this.http.post('/topic/batch/insertOrUpdate',this.rows),{
            success: (data: any) => {
                this.handler.toast({text:data.tip});
                this.selectClassifyList();
                this.ids = [];
                this.rows = [];
            }
        })
    }
}