/*
 * @Author: your name
 * @Date: 2020-03-26 21:52:55
 * @LastEditTime: 2020-03-27 11:56:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\core\components\commons\emoji\emoji.ts
 */
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref, Emit } from 'vue-property-decorator';
/** twemoji 可引入twemoji的cdn js */
interface TWemoji {
    /** 转换器 */
    convert: {
        /** unicode 转 码点 */
        toCodePoint: Function;
        /** 码点 转 unicode */
        fromCodePoint: Function
    };
    /** DOM parsing, 将节点内unicode或表情符转成含有img标签的html */
    parse(el: HTMLElement| Node, args?: any): Function;

}

@Component
export default class EmojiComponent extends Vue {

    /** 表情列表容器 */
    @Ref('emoji_list')
    emojiList!: any;
    
    /** 表情列表 */
    emojis: any [] = [
        /**   码点    unicode  表情符      描述   */
        {cp: '1f600', uc: '', text: '😀', title: '微笑'},
        {cp: '1f605', uc: '', text: '😅', title: '汗'},
        {cp: '1f923', uc: '', text: '🤣', title: '笑尿1'},
        {cp: '1f602', uc: '', text: '😂', title: '笑尿2'},
        {cp: '1f643', uc: '', text: '🙃', title: '倒笑'},
        {cp: '1f609', uc: '', text: '😉', title: '放电'},
        {cp: '1f60a', uc: '', text: '😊', title: '害羞'},
        
        {cp: '1f929', uc: '', text: '🤩', title: '眼睛放星'},
        {cp: '1f618', uc: '', text: '😘', title: '亲吻'},
        {cp: '1f92a', uc: '', text: '🤪', title: '装傻'},
        {cp: '1f61c', uc: '', text: '😜', title: '调皮'},
        {cp: '1f911', uc: '', text: '🤑', title: '钱钱钱'},
        {cp: '1f637', uc: '', text: '😷', title: '口罩'},
        {cp: '1f634', uc: '', text: '😴', title: '睡觉'},
        
        {cp: '1f92e', uc: '', text: '🤮', title: '呕吐'},
        {cp: '1f60c', uc: '', text: '😌', title: '无奈'},
        {cp: '1f60f', uc: '', text: '😏', title: '自鸣得意'},
        {cp: '1f635', uc: '', text: '😵', title: '选择无视'},
        {cp: '1f60e', uc: '', text: '😎', title: '装酷'},
        {cp: '1f9d0', uc: '', text: '🧐', title: '搜寻'},
        {cp: '1f621', uc: '', text: '😡', title: '生气'},
        
        {cp: '1f92c', uc: '', text: '🤬', title: '脏话'},
        {cp: '1f4a9', uc: '', text: '💩', title: '便便'},
        {cp: '1f48b', uc: '', text: '💋', title: '烈焰红唇'},
        {cp: '1f44c', uc: '', text: '👌', title: '好的'},
        {cp: '1f91f', uc: '', text: '🤟', title: '爱你'},
        {cp: '1f44d', uc: '', text: '👍', title: '点赞'},
        {cp: '1f44e', uc: '', text: '👎', title: '反对'},

        {cp: '1f44f', uc: '', text: '👏', title: '鼓掌'},
        {cp: '1f440', uc: '', text: '👀', title: '偷看'},
        {cp: '1f31a', uc: '', text: '🌚', title: '脸黑'},
        {cp: '1f37b', uc: '', text: '🍻', title: '干杯'},
        {cp: '1f389', uc: '', text: '🎉', title: '庆祝'},
        {cp: '1f381', uc: '', text: '🎁', title: '礼物'},
        {cp: '1f382', uc: '', text: '🎂', title: '蛋糕'},
    ];

    /** 表情列表是否打开 */
    open: boolean = false;

    constructor() {
        super();
    }
    
    mounted() {
        const twemoji = <TWemoji>((<any>window).twemoji);
        twemoji&&twemoji.parse(this.emojiList);   
    }

    /**
     * 选择某个表情
     * @param v 表情对象
     */
    @Emit('selectEmoji')
    selectEmoji(v: any) {
        v.uc = this.getUnicodeStr(v.text);
        return v;
    }

    /**
     * 获取统一编码字符
     * @param str 表情
     */
    private getUnicodeStr(str: string) {
        return escape(str).replace(/%/g, '\\');
    }

    /**
     * 打开或关闭表情列表
     */
    switchEmojiList() {
        this.open = !this.open;
    }
}