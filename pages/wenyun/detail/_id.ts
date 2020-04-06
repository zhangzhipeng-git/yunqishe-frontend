import App from '@/core/context/app-context.ts';
import Component from 'vue-class-component';
import BaseComponent from '@/core/base-component.ts';
import ReplyComponent from '@/core/modules/components/commons/reply/reply.vue';
import SidebarComponent from '@/core/modules/components/projections/sidebar/sidebar.vue';
import { Context } from '@nuxt/types';
const options: any = {
    layout: 'app',
    components: {
        ReplyComponent,
        SidebarComponent
    },
    async asyncData(context: Context) {
        let invitation;
        const http = App.getAppContext().getHttp();
        await http.httpRequest(http.get('/local/forum/getInvitation'), {
            success: (data: any) => {
                invitation = data;
            }
        },context);
        return {
            invitation
        }
    },
}
@Component(options)
export default class WenyunDetailComponent extends BaseComponent {
    /** 内容详情id */
    id: number = -1;
    constructor() {
        super();
    }

    private mounted(): void {
        this.handleImg();
        const id = parseInt(this.$route.params.id, 10);
        console.log(id);
        this.id = id;
    }

    /**
     * 点击收藏/赞/踩 ，赞和踩不能同时出现
     * @param e 点击事件
     * @param id 帖子/文章/评论id
     * @param conserve 是否存在顶踩互斥
     */
    async action(e: any, id: number, conserve: boolean) {
        // 是否频繁操作
        // 先在前端显示收藏/赞/踩 -> 成功/失败
        // 再向后端发起请求
        // 如果收藏失败则回滚前端显示
        const target = e.currentTarget || e.srcElement;
        const icon = target.firstChild; // 图标
        const text = target.lastChild;  // 收藏/赞/踩数量
        const icls = icon.className;
        const count = text.innerHTML;
        if (icls.indexOf('-o') > -1) { // +1
            this.addCount(icls, count, icon, text);
            const result = await this.updateCount(+1, icls);
            if (!result) { // 回滚显示
                this.decreaseCount(icls, count, icon, text);
            }
        } else { // -1
            this.decreaseCount(icls, count, icon, text);
            const result = await this.updateCount(-1, icls);
            if (!result) { // 回滚显示
                this.addCount(icls, count, icon, text);
            }
        }
    }

    /**
     * + +1 操作
     * @param icls 图标类名
     * @param count 收藏/点赞/踩的数量
     * @param icon  icon元素
     * @param text  收藏/点赞/踩元素
     */
    addCount(icls: string, count: any, icon: any, text: any) {
        icon.className = icls.replace('-o', '');
        icon.className += ' wd-color-red-wram';
        text.innerHTML = (!!count.trim()? count*1 : 0) + 1;
    }

    /**
     * - -1操作
     * @param icls 图标类名
     * @param count 收藏/点赞/踩的数量
     * @param icon  icon元素
     * @param text  收藏/点赞/踩元素
     */
    decreaseCount(icls: string, count: any, icon: any, text: any) {
        const result = (!!count.trim()? count*1 : 1) - 1;
        text.innerHTML = result === 0 ? '' : result;
        icon.className = icls.replace(' wd-color-red-wram', '');
        icon.className +='-o';
    }

    /**
     * 更新
     * @param count -1 或 + 1
     * @param icls 图标类名
     * @returns {boolean} true - 成功 false - 失败
     */
    updateCount(count: number, icls: string): Promise<boolean> {
        return new Promise((res, rej) => {
            if (icls.indexOf('icon-star') > -1) { // 收藏或取消收藏

            } else if (icls.indexOf('icon-thumb-up') > -1) { // 赞，与踩互斥
    
            } else if (icls.indexOf('icon-thumb-down') > -1) { // 踩，与顶互斥
    
            }
            res(true);
        });
    }

    /**
     * 接受回复内容
     * @param v 回复内容 + 负载参数
     */
    reciveReply(v: any) {
        console.log(v);
    }


}