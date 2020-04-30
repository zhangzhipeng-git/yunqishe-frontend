import Vue from 'vue';
import Component from 'vue-class-component';
import BaseComponent from '@/core/base-component.ts';
const options={
    layout: 'app'
}
@Component(options)
export default class LearnComponent extends BaseComponent {
    head: any = {};
    constructor() {
        super();
    }

    private mounted(): void {
        // 去文档页
        this.$router.push('/learn/docClass')
    }

    destroyed() {

    }

    
}