import Vue from 'vue';
import strCut from '~/core/modules/filters/strCut';
import Component from 'vue-class-component';
import TableComponent from '@/core/modules/components/commons/table/table.vue';
import SelectComponent from '@/core/modules/components/commons/form/select/select.vue';
import ButtonComponent from '@/core/modules/components/commons/form/button/button.vue';
import SwitchComponent from '@/core/modules/components/commons/form/switch/switch.vue';
import WindowComponent from '@/core/modules/components/commons/biz-alert/_window/window.vue';
import EditorComponent from '@/core/modules/components/commons/editor/editor.vue';
import { Ref } from 'vue-property-decorator';
import BaseComponent from '~/core/base-component';

@Component({layout:'admin',
    components: {
        ButtonComponent,
        SelectComponent,
        TableComponent,
        SwitchComponent,
        WindowComponent,
        EditorComponent
    },
    filters: {
        strCut
    }
})
export default class mediaComponent extends BaseComponent{
    
    /** 1-一级分类，2-二级分类，3-媒体*/
    level: number = 1;
    /** 从1级分类->2级分类的1级分类的id,即2级分类的pid */
    pid_for2: number|any = '';
    /** 从2级分类->媒体的2级分类的id,即媒体的pid */
    pid_for3: number|any = '';
    /** 搜索名称 */
    searchName: string = '';
    /** 是否可见 */
    searchVisible: number|any = '';
    /** 是否可见 */
    visibleList: any[] = [
        { id: 0, description: '不可见' },
        { id: 1, description: '可见' },
    ];
    /** 是否收费 */
    searchStrategy: number|any = '';
    /** 是否付费 */
    strategyList: any[] = [
        { id: 0, description: '免费' },
        { id: 1, description: '付费' }
    ];
    /** 媒体类型4-图片，5-音乐，6-视频 */
    searchType: number|any = '';
    /** 媒体类型列表 */
    typeList: any[] = [
        { id: 4, description: '图片' },
        { id: 5, description: '音乐' },
        { id: 6, description: '视频' }
    ];
    /** 弹出层标题 */
    operateTitle: string = '';
    /** 新增或编辑的media分类 */
    entity: any = {};
    /** media分类列表 */
    list: any[] = [];
    /** 选中的行 */
    rows: any[] = [];
    /** 弹出层窗体 */
    @Ref('window')
    window: any;
    /** 获取当前列表的pid */
    get pid() {
        let pid;
        if (this.level === 1) {
            pid = -1;
        } else if (this.level === 2){
            pid = this.pid_for2;
        } else if (this.level === 3) {
            pid = this.pid_for3;
        }
        return pid;
    }
    /** 获取当前列表的描述 */
    get description() {
        let des;
        if (this.level === 1) {
            des = '一级分类';
        } else if (this.level === 2) {
            des = '二级分类';
        } else {
            des = '媒体';
        }
        return des;
    }

    /** 获取实体api前缀 */
    get APIPrefix() {
        return this.level === 3?'/mediaContent':'/mediaClass';
    }

    constructor() {
        super();
    }

    activated() {
        this.selectEntities(this.pid);   
    }

    /**
     * 去第几类
     * @param level 类的层级
     */
    goClass(level: number) {
        this.level = level;
        this.selectEntities(this.pid);
    }

    /**
     * 根据父id找子分类
     * @param pid 媒体分类父id
     */
    selectEntities(pid: number) {
        this.httpRequest(this.http.get(this.APIPrefix + '/b/select/list?pid='+pid), {
            success: (data: any) => {
                this.list = this.level!==3
                ?data.mediaClasses:data.mediaContents;
            }
        });
    }

    /**
     * 插入分类
     */
    insert$() {
        this.operateTitle = '添加' + this.description;
        this.entity = {
            level: this.level,
            pid:this.pid
            ,name:'',
            cover:'',
            strategy:0,
            visible:1
        };
        this.window.open();
    }

    /**
     * 编辑
     */
    select$() {
        if (this.rows.length !== 1) {
            return;
        }
        this.selectOneByPrimaryKey(this.rows[0].id);
    }

    /**
     * 删除
     */
    delete$() {
        if (this.rows.length !== 1) {
            return;
        }
        this.deleteOneOrListByPrimaryKey(this.rows[0].id);
    }

    /**
     * 保存
     */
    update$() {
        this.insertOrUpdate(this.rows);
    }

    /**
     * 搜索
     */
    search$() {
        const qstr = '?level='+this.level
        +'&pid='+this.pid
        +'&searchName='+this.searchName
        +'&searchVisible='+this.searchVisible
        +'&searchStrategy='+this.searchStrategy;
        this.httpRequest(this.http.get(this.APIPrefix + '/b/select/filter/list'+qstr), {
            success: (data: any) => {
                this.list = this.level!==3
                ?data.mediaClasses:data.mediaContents;
            }
        });
    }

    /**
     * 点击某行的编辑
     * @param {{row: any; index: number}}
     */
    selectOne({row}: any) {
        this.fixEditorBug();
        this.selectOneByPrimaryKey(row.id);
    }

    /**
     * 点击某行的删除
     * @param {{row: any; index: number}}
     */
    deleteOne({row}: any) {
        this.deleteOneOrListByPrimaryKey([row.id]);
    }

    /**
     * 关闭弹出层
     */
    close() {
        this.window.close();
    }

    /**
     * 确认后关闭弹出，新增或修改
     */
    confirm() {
        this.window.close();
        this.insertOrUpdate(this.entity);
    }

    /**
     * 根据id查某个分类媒体
     * @param id 媒体分类id
     */
    selectOneByPrimaryKey(id: number) {
        this.operateTitle = '编辑' + this.description;
        this.httpRequest(this.http.get(this.APIPrefix + '/b/select/one?id='+id), {
            success: (data: any) => {
                this.entity = this.level!==3
                ?data.mediaClass:data.mediaContent;
                this.window.open();
            }
        });
    }

    /**
     * 根据id删除单个或多个媒体分类
     * @param v 单个或多个媒体分类id
     */
    deleteOneOrListByPrimaryKey(ids: number[]) {
        this.httpRequest(this.http.post(this.APIPrefix + '/b/delete/oneOrList', ids), {
            success: (data: any) => {
                this.rows = [];
                this.handler.toast({text: data.tip});
            }
        })
    }

    /**
     * 新增或更新
     * @param v 
     */
    insertOrUpdate(v: any|any[]) {
        let t: string;
        // 单个或批量修改
        if (v instanceof Array || v.id !==undefined) {
            t = '/update/oneOrList';
            if (!(v instanceof Array)) {
                v = [v];
            }
        } else { // 单个插入
            t = '/insert/one';
        }
        if (v.length && v.length === 0) return;
        this.httpRequest(this.http.post(this.APIPrefix + '/b'+t, v), {
            success: (data: any) => {
                if (t === '/update/oneOrList') {
                    this.rows = [];
                }
                this.handler.toast({text: data.tip});
                this.goClass(this.level);
            }
        })
    }

    /**
     * 去子级列表
     * @param param0 
     */
    viewsChild({row}: any) {
        this.list = [];
        if (this.level === 1) {
            this.pid_for2 = row.id;
        } else if (this.level === 2){
            this.pid_for3 = row.id;
        }
        if (this.level < 3) {
            this.level++;
        }
        this.selectEntities(row.id);
    }

    fixEditorBug() {
        this.entity.text = '';
    }
}