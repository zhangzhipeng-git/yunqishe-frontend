import Component from 'vue-class-component';
import SwitchComponent from '../../../../core/modules/components/commons/form/switch/switch';
import ButtonComponent from '../../../../core/modules/components/commons/form/button/button';
import BaseComponent from '../../../../core/base-component';
@Component({layout:'admin', components: {
    SwitchComponent,
    ButtonComponent
}})
export default class IndexComponent extends BaseComponent {

    /** 开关实体 */
    switch$: any = {};

    constructor() {
        super();
    }

    beforeMount() {
        this.selectOne();
    }

    /**
     * 查询开关
     */
    selectOne() {
        this.handler.load();
        this.httpRequest(this.http.get('/switch/b/select/one'), {
            success: (data: any) => {
                this.switch$ = data.switch;
                this.handler.unload();
            }
        });
    }

    /**
     * 更新开关
     */
    updateOne() {
        this.handler.load();
        this.httpRequest(this.http.post('/switch/b/update/one', this.switch$), {
            success: () => {
                this.handler.toast({text:'保存成功'});
                this.handler.unload();
            }
        });
    }

}