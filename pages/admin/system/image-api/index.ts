/*
* @Author: your name
* @Date: 2020-03-08 21:12:21
* @LastEditTime: 2020-03-15 23:28:42
* @LastEditors: Please set LastEditors
* @Description: In User Settings Edit
* @FilePath: \nuxt-ssr\pages\admin\circle-and-circle\list\list.ts
*/
import Component from 'vue-class-component';
import strCut from '~/core/modules/filters/strCut';
import TableComponent from '@/core/modules/components/commons/table/table';
import BaseComponent from '~/core/base-component';
import ButtonComponent from '@/core/modules/components/commons/form/button/button';
import SelectComponent from '@/core/modules/components/commons/form/select/select.vue';
import WindowComponent from '@/core/modules/components/commons/biz-alert/_window/window.vue';
import PageBarComponent from '@/core/modules/components/commons/page-bar/page-bar.vue';
import UploadComponent from '../../../../core/modules/components/commons/upload/upload';
import InputComponent from '../../../../core/modules/components/commons/form/input/input';
import { Ref } from 'vue-property-decorator';
@Component({
    layout: 'admin',
    filters: {
        strCut
    },
    components: {
        TableComponent,
        WindowComponent,
        SelectComponent,
        ButtonComponent,
        PageBarComponent,
        UploadComponent,
        InputComponent
    }
})
export default class ListComponent extends BaseComponent {
    /** 所属模块类型（用户配置轮播） */
    typeList: any[] = [
        { id: 1, description: '首页' },
        { id: 2, description: '圈子' },
        { id: 3, description: '微视频' }
    ];
    /** 默认所属模块为首页 */
    searchType: number = 1;
    /** 图片配置列表 */
    imageDisposes: any[] = [];
    /** 分页信息 */
    pageInfo: any = {};
    /** 分页查询参数 */
    pageQueryStr: string = '';
    /** 操作, 默认更新操作 */
    operate: string = 'update';
    /** 操作标题 */
    operateTitle: string = '';
    /** 某个图片配置 */
    imageDispose: any = {};
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
     * 查询图片配置列表
     */
    selectList() {
        const queryStr = '?searchType=' + this.searchType + '&' + this.pageQueryStr;
        return this.httpRequest(this.http.get('/imageDispose/b/select/list' + queryStr), {
            success: (data: any) => {
                const pageInfo = data.pageInfo;
                this.handleList(pageInfo.list);
                // 获取图片配置列表
                this.imageDisposes = pageInfo.list;
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
            }
        });
    }

    /**
     * 转换所属类别微所属类别描述
     * @param list 图片列表
     */
    handleList(list: any[]) {
        list.forEach((e: any) => {
            switch(e.type) {
                case 1: e.typeDesc = '首页';break;
                case 2: e.typeDesc = '圈子';break;
                case 3: e.typeDesc = '微媒体';break;
            }
        })
    }

    /**
     * 去那一页或改变每页大小
     * @param o 
     */
    toPage(o: any) {
        this.pageQueryStr = o.queryStr;
        this.selectList();
    }

    /**
     * 点击添加按钮，添加图片配置
     */
    insert$() {
        this.operate = 'insert';
        this.operateTitle = '添加图片配置';
        this.imageDispose = {type:1, url:''};
        this.window.open();
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
        this.operateTitle = '编辑图片配置';
        this.httpRequest(this.http.get('/imageDispose/b/select/one?id=' + row.id), {
            success: (data: any) => {
                this.imageDispose = data.imageDispose;
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
     * 添加或修改图片配置
     * 单个插入，单个或批量更新
     */
    insertOrUpdate(imageDispose: any | any[]) {
        const insert = this.operate === 'insert';
        imageDispose = insert ? imageDispose : (imageDispose.length ? imageDispose : [imageDispose]);
        this.httpRequest(this.http.post('/imageDispose/b/' + (!insert ? 'batch/update' : 'insert/one'), imageDispose), {
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
        this.httpRequest(this.http.post('/imageDispose/b/batch/delete', ids), {
            success: (data: any) => {
                this.selectList();
                this.handler.toast({ text: data.tip });
                this.rows = [];
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
        this.imageDispose.type = this.searchType;
        this.insertOrUpdate(this.imageDispose);
    }

    /**
     * 上传图片
     */
    uploadImg(e: any) {
        this.handler.load();
        const file = e.currentTarget.files[0];
        // 未选择文件
        if (!file) return;
        const param = new FormData();
        param.append('file', file);
        const config = {
            headers:{"Content-Type": "multipart/form-data"},
        };
        this.httpRequest(this.http.$post('/bucket/b/upload/img',param, {config}), {
            success: (data: any) => {
                this.handler.unload();
                this.imageDispose.url = data.url;
            }
        });
    }

    /**
     * 选择下拉框中某一项
     */
    change() {
        this.selectList();
    }
}