import Vue from 'vue';
import Component from 'vue-class-component';
import BaseComponent from '@/core/base-component.ts';
const options={
    layout: 'app'
}
@Component(options)
export default class LearnComponent extends BaseComponent {
    head: any = {};
    list: any[] = [];
    constructor() {
        super();
    }

    mounted() {
        // 查询前两级文档分类集合，一级分类和其子级分类（二级分类）
        this.httpRequest(this.http.get('/docClass/f/select/top2lv/list'), {
            success: (data: any) => {
                this.list = data.docClasses;
            }
        })   
    }
}