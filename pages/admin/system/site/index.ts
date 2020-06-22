import Component from 'vue-class-component';
import InputComponent from '@/core/modules/components/commons/form/input/input';
import ButtonComponent from '../../../../core/modules/components/commons/form/button/button';
import BaseComponent from '../../../../core/base-component';
import { ReactiveForm } from '../../../../core/modules/annotations/index';

@Component({
    layout: 'admin',
    components: {
        InputComponent,
        ButtonComponent
    }
})
@ReactiveForm
export default class IndexComponent extends BaseComponent {

    siteInfo: any  = {};

    constructor() {
        super();
    }

    beforeMount() {
        this.selectOne();
    }
    /**
     * 查询站点信息
     */
    selectOne() {
        this.handler.load();
        this.httpRequest(this.http.get('/siteInfo/b/select/one'), {
            success: (data: any) =>  {
                this.siteInfo = data.siteInfo;
                this.handler.unload();
            }
        });
    }

    /**
     * 更新站点信息
     */
    updateOne() {
        this.handler.load();
        this.httpRequest(this.http.post('/siteInfo/b/update/one', this.siteInfo), {
            success: (data: any) =>  {
                this.handler.unload();
                this.handler.toast({text: "更新成功~"});
            }
        });
    }
}