/*
 * Filvalue: d:\frontend\vue\nuxt-ssr\components\commons\editor\editor.ts
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Sunday, December 29th 2019, 4:54:15 pm
 * Author: zzp-dog
 * 富文本编辑器
 * Copyright (c) 2019 Your Company
 */
import Vue from "vue";
import { Prop, Emit, Model, Ref, Watch } from "vue-property-decorator";
import Component from "vue-class-component";
import TipComponent from "./_alert/tip/tip";            // 提示弹窗
import WindowComponent from "./_alert/window/window";   // 窗体弹窗
import UILink from "./ui-link/ui-link.vue";             // 超链接UI
import UITable from "./ui-table/ui-table.vue";          // 表格UI
import UIAnnex from "./ui-annex/ui-annex.vue";          // 附件UI
/** 编辑器配置参数 */
interface Options {
    /** 编辑内容的最大字节数 */
    maxsize: number;
    /** 上传图片的配置参数 */
    image: {
        /** 上传的最大图片数量 */
        count: number;
        /** 小于指定字节数会进行base64编码 */
        base64: number;
        /** 图床配置 */
        server: {
            /** 图床上传url */
            api: string;
            /** 上传成功返回对象 */
            success: { code: number; imgurl: string };
            /** 上传失败返回对象 */
            error: { code: number; msg: string };
        };
    };
    /** 上传视频的配置参数 */
    video: {
        /** 上传的最大视频数量 */
        count: number;
        /** 视频床配置 */
        server: {
            /** 视频床上传url */
            api: string;
            /** 上传成功返回对象 */
            success: { code: number; imgurl: string };
            /** 上传失败返回对象 */
            error: { code: number; msg: string };
        };
    };
    /** 上传音频的配置参数 */
    music: {
        /** 上传的最大音频数量 */
        count: number;
        /** 音频床配置 */
        server: {
            /** 音频床上传url */
            api: string;
            /** 上传成功返回对象 */
            success: { code: number; imgurl: string };
            /** 上传失败返回对象 */
            error: { code: number; msg: string };
        };
    };
}
@Component
export default class EditorComponent extends Vue {
    /** v-model */
    @Model('input')
    @Prop({ type: String, default: '<p>🚀我是一个编辑器,快来点我吧~</p>' })
    vhtml!: string;
    /** 是否有按钮 */
    @Prop({ type: Boolean, default: false })
    hasBtn!: boolean;
    /** 字体样式 */
    fontFamilys = [
        { key: "arial", value: "arial" },
        { key: "微软雅黑", value: "Microsoft Yahei" },
        { key: "宋体", value: "SimSun" },
        { key: "黑体", value: "SimHei" },
        { key: "楷体", value: "KaiTi" },
        { key: "宋体", value: "SimSun" },
        { key: "新宋体", value: "NSimSun" },
        { key: "仿宋", value: "FangSong" },
        { key: "微软正黑体", value: "Microsoft JhengHei" },
        { key: "华文琥珀", value: "STHupo" },
        { key: "华文彩云", value: "STCaiyun" },
        { key: "幼圆", value: "YouYuan" },
        { key: "华文行楷", value: "STXingkai" }
    ];
    /** 文本格式 */
    formatBlocks = [
        { key: "p", value: '<p data-index="0">p</p>' },
        { key: "h6", value: '<h6 data-index="1">h6</h6>' },
        { key: "h5", value: '<h5 data-index="2">h5</h5>' },
        { key: "h4", value: '<h4 data-index="3">h4</h4>' },
        { key: "h3", value: '<h3 data-index="4">h3</h3>' },
        { key: "h2", value: '<h2 data-index="5">h2</h2>' },
        { key: "h1", value: '<h1 data-index="6">h1</h1>' }
    ];
    /** 颜色 */
    colors = [
        [
            "#ffffff",
            "#000000",
            "#eeece1",
            "#1f497d",
            "#4f81bd",
            "#c0504d",
            "#9bbb59",
            "#8064a2",
            "#4bacc6",
            "#f79646"
        ],
        [
            "#f2f2f2",
            "#7f7f7f",
            "#ddd9c3",
            "#c6d9f0",
            "#dbe5f1",
            "#f2dcdb",
            "#ebf1dd",
            "#e5e0ec",
            "#dbeef3",
            "#fdeada"
        ],
        [
            "#d8d8d8",
            "#595959",
            "#c4bd97",
            "#8db3e2",
            "#b8cce4",
            "#e5b9b7",
            "#d7e3bc",
            "#ccc1d9",
            "#b7dde8",
            "#fbd5b5"
        ],
        [
            "#bfbfbf",
            "#3f3f3f",
            "#938953",
            "#548dd4",
            "#95b3d7",
            "#d99694",
            "#c3d69b",
            "#b2a2c7",
            "#92cddc",
            "#fac08f"
        ],
        [
            "#a5a5a5",
            "#262626",
            "#494429",
            "#17365d",
            "#366092",
            "#953734",
            "#76923c",
            "#5f497a",
            "#31859b",
            "#e36c09"
        ],
        [
            "#7f7f7f",
            "#0c0c0c",
            "#1d1b10",
            "#0f243e",
            "#244061",
            "#632423",
            "#4f6128",
            "#3f3151",
            "#205867",
            "#974806"
        ],
        [
            "#c00000",
            "#ff0000",
            "#ffc000",
            "#ffff00",
            "#92d050",
            "#00b050",
            "#00b0f0",
            "#0070c0",
            "#002060",
            "#7030a0"
        ]
    ];
    /** 字体大小 */
    fontSizes = [
        { key: "xx-small", value: "1" },
        { key: "x-small", value: "2" },
        { key: "small", value: "3" },
        { key: "medium", value: "4" },
        { key: "large", value: "5" },
        { key: "x-large", value: "6" },
        { key: "xx-large", value: "7" }
    ];
    /** code */
    codes = ['Html', 'Css', 'Js', 'TypeScript', 'Sass', 'Java', 'Xml', 'Sql', 'Shell'];
    /** 选中的字样 */
    fontFamily: any = { key: "微软雅黑", value: "Microsoft Yahei" };
    /** 选中的字号 */
    fontSize: any = { key: "small", value: 3 };
    /** 文本格式 */
    formatBlock = "p";
    /** 字体颜色 */
    foreColor = "black";
    /** 高亮色 */
    backColor = "white";
    /** 当前代码语言 */
    code = 'Js';

    /** 是否打开字样面板 */
    switchFontFamilyPannel: boolean = false;
    /** 是否打开字号面板 */
    switchFontSizePannel: boolean = false;
    /** 是否打开文本格式面板 */
    switchFormatBlockPannel: boolean = false;
    /** 是否打开字体颜色面板 */
    switchForeColorPannel: boolean = false;
    /** 是否打开背景色面板 */
    switchBackColorPannel: boolean = false;
    /** 是否打开代码语言面板 */
    switchCodePannel: boolean = false;

    /** 文字对齐方向 */
    justifyActive = {
        /** 居左是否聚焦 */
        left: true,
        /** 居中是否聚焦 */
        center: false,
        /** 居右是否聚焦 */
        right: false,
        /** 左右对齐是否聚焦 */
        full: false
    };
    /** 编辑面板 */
    @Ref('edit_pannel')
    pannel!: any;
    /** 配置参数，应该从后台查配置参数 ！！！*/
    @Prop({
        type: Object,
        default: () => {
            return {}
        }
    })
    options!: Options;
    get options$() {
        return Object.assign({
            maxsize: 65535,
            image: {
                count: 5,
                base64: 60000,
                server: {
                    enable: false,      // 服务器是否开启
                    api: "/api/image",  // 图片服务器地址
                    filename: "file",   // 文件name
                    success: {
                        code: 1
                    },
                    error: {
                        code: 204002,
                        msg: "\u56fe\u7247\u4e0a\u4f20\u5931\u8d25\uff01"
                    }
                }
            }
        }, this.options);
    }

    /** 当输入值有值的时候，取消vhtml$的重新赋值，避免重新赋值导致光标丢失！！！ */
    /** 如果确实要重新输入绑定，请设置一次vhtml为空！！！ */
    vhtml$: string = '';
    /** 是否取消对vhtml$的重新赋值,默认false */
    noChange: boolean = false;
    @Watch('vhtml')
    watchVHTML(nv: string) {
        if (nv && !this.noChange) { // 重新输入绑定
            this.vhtml$ = this.vhtml;
            this.noChange = true;
            return;
        }
        if (!nv) { // 标记需要重新输入绑定
            this.vhtml$ = '';
            this.noChange = false;
        };
    }

    constructor() {
        super();
    }

    /**
     * 查询是否支持命令和设置光标
     */
    querySupportCMD(e: any) {
        e = e || window.event;
        let t = e.target || e.srcElement;

        // 找到类wd-edit-link-box的元素
        const tn = t.tagName;
        if (tn === "A") t = t.parentNode;
        if (tn === "I") t = t.parentNode.parentNode;

        const tcls = t.className;
        if (!tcls || tcls.indexOf("wd-edit-link-box") < 0) return;
        const cmd = tcls.split(/\s+/)[1];

        // 查全部命令是否支持
        if (!this.isSupport(cmd)) {
            TipComponent.showTip({
                text: "浏览器不支持~"
            });
            return
        }
    }

    /**
     * 查询是否支持命令
     * @param cmd 命令
     */
    isSupport(cmd: string): boolean {
        return document.queryCommandSupported(cmd);
    }

    /**
     * 当用户点击头部编辑条时调用或点击编辑面板时调用
     * 先判断编辑面板是否聚焦，如果聚焦直接退出
     * ,获取上次光标位置,设置当前编辑样式
     */
    edit(e: any) {
        e = e || window.event;
        const editPannel: any = this.pannel;
        // 判断是否聚焦
        if (document.activeElement === editPannel) return;
        // 设置光标
        this.setRange();
        // 不在代码区 && 获取当前设置的格式，并重新设置
        this.setHistoryFormat();
    }

    /**
     * 设置当前所有格式
     */
    setHistoryFormat() {
        if (this.isRangeInCode()) return;
        // 设置文本格式
        document.execCommand('formatBlock', false, this.formatBlock);
        document.execCommand("fontName", false, this.fontFamily.value);
        document.execCommand("fontSize", false, this.fontSize.value);
        document.execCommand("foreColor", false, this.foreColor);
        document.execCommand("backColor", false, this.backColor);
        if (this.justifyActive.left) {
            document.execCommand("justifyLeft", false, "");
        } else if (this.justifyActive.right) {
            document.execCommand("justifyRight", false, "");
        } else if (this.justifyActive.center) {
            document.execCommand("justifyCenter", false, "");
        } else if (this.justifyActive.full) {
            document.execCommand("justifyFull", false, "");
        }
    }

    /**
     * 设置字样
     * @param e 事件
     */
    setFontName(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e); // 阻止编辑面板失焦
        const t = e.target;
        this.switchFontFamilyPannel = !this.switchFontFamilyPannel;
        const index = t.getAttribute("data-index");
        if (index === null || index === undefined) return;
        this.fontFamily = this.fontFamilys[index * 1];
        this.cmd("fontName", false, this.fontFamily.value);
    }

    /**
     * 设置字号
     */
    setFontSzie(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e); this.edit(e); // 阻止编辑面板失焦
        const t = e.target;
        this.switchFontSizePannel = !this.switchFontSizePannel;
        const index = t.getAttribute("data-index");
        if (index === null || index === undefined) return;
        const fontSize = this.fontSizes[index * 1];
        this.fontSize = fontSize;
        this.cmd("fontSize", false, fontSize.value);
    }

    /**
     * 设置文本格式
     * @param e 事件
     */
    setFormatBlock(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e); // 阻止编辑面板失焦
        const t = e.target;
        this.switchFormatBlockPannel = !this.switchFormatBlockPannel;
        const index = t.getAttribute("data-index");
        if (index === null || index === undefined) return;
        const formatBlock = this.formatBlocks[index * 1];
        this.formatBlock = formatBlock.key;
        this.cmd("formatBlock", false, "<" + this.formatBlock + ">");
    }

    /**
     * 设置前景色
     * @param e 事件
     */
    setForeColor(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e); // 阻止编辑面板失焦
        const t = e.target;
        this.switchForeColorPannel = !this.switchForeColorPannel;
        const x = t.getAttribute("data-dim1");
        const y = t.getAttribute("data-dim2");
        if (x === null || y == null) return;
        this.foreColor = this.colors[x][y];
        this.cmd("foreColor", false, this.foreColor);
    }

    /**
     * 设置背景色(高亮色)
     * @param e 事件
     */
    setBackColor(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e); // 阻止编辑面板失焦
        const t = e.target;
        this.switchBackColorPannel = !this.switchBackColorPannel;
        const x = t.getAttribute("data-dim1");
        const y = t.getAttribute("data-dim2");
        if (x === null || y == null) return;
        this.backColor = this.colors[x][y];
        this.cmd("backColor", false, this.backColor);
    }

    /**
     * 设置代码语言
     * @param e 事件
     */
    insertCode(e: any) {
        e = e || window.event;
        e.preventDefault();
        // 阻止编辑面板失焦
        this.edit(e);
        if (!this.canExecCMD()) return;
        this.switchCodePannel = !this.switchCodePannel;
        const index = e.target.getAttribute('data-index');
        if (index === null) return;
        this.code = this.codes[index];
        let html = '<p style="height:0Px">&#8203;</p><pre title="代码区" class="code '
            + this.code.toLowerCase() + '"><code class="'
            + this.code.toLowerCase() + '"><p>&zwnj;</p></code></pre><br/>';
        this.removeFormat(e);
        this.insertHTML(html);
        // 插入html后，将光标移至代码区
        const container: any = this.getRangeContainer();
        if (!container || !container.start) return;
        const p = this.getPreNode(container.start);
        this.setRangeToElement(p);
    }

    getPreNode(n: any) {
        let pre = n.previousSibling;
        while(pre&&pre.nodeType!==1) {
            pre = pre.previousSibling;
        }
        return pre;
    }

    /**
     * 设置粗体
     */
    switchBold(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("bold", false, "");
    }

    /**
     * 设置斜体
     */
    switchItalic(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("italic", false, "");
    }

    /**
     * 设置下划线
     */
    switchUnderline(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("underline", false, "");
    }

    /**
     * 设置删除线
     */
    switchStrikeThrough(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("strikeThrough", false, "");
    }

    /**
     * 设置上标
     */
    superscript(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("superscript", false, "");
    }

    /**
     * 设置下标
     */
    subscript(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("subscript", false, "");
    }

    /**
     * 设置setJustifyactive
     * @param str 'left' | 'center' | 'right' | 'full'
     */
    setJustifyactive(str: string) {
        const o = { left: false, right: false, center: false, full: false };
        const keys = Object.keys(o);
        for (let i = 0, len = keys.length; i < len; i++) {
            if (keys[i] === str) {
                (<any>o)[keys[i]] = true;
                break;
            }
        }
        this.justifyActive = o;
    }
    /**
     * 居左
     */
    justifyLeft(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.setJustifyactive("left");
        this.cmd("justifyLeft", false, "");
    }

    /**
     * 居左
     */
    justifyRight(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.setJustifyactive("right");
        this.cmd("justifyRight", false, "");
    }

    /**
     * 居左
     */
    justifyCenter(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.setJustifyactive("center");
        this.cmd("justifyCenter", false, "");
    }

    /**
     * 居左
     */
    justifyFull(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.setJustifyactive("full");
        this.cmd("justifyFull", false, "");
    }

    /**
     * 缩进
     */
    indent(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("indent", false, "");
    }

    /**
     * 减少缩进
     */
    outdent(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("outdent", false, "");
    }

    /**
     * 插入有序列表
     */
    insertOrderedList(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("insertOrderedList", false, "");
    }

    /**
     * 插入无序列表
     */
    insertUnorderedList(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("insertUnorderedList", false, "");
    }

    /**
     * 插入表格调起插入表格UI
     */
    insertTable(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.canExecCMD() &&
            WindowComponent.showWindow({
                title: "插入表格",
                animation: "scale",
                content: UITable,
                handler: this
            });
    }
    /**
     * 点击表格UI弹窗确认时回调
     * @param html 插入的html
     */
    recieveTableHTML(html: string) {
        this.setRange();
        this.insertHTML(html);
        return true;
    }
    /**
     * 插入超链接调起插入超链接UI
     * @param e 事件
     */
    insertLink(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.canExecCMD() &&
            WindowComponent.showWindow({
                title: "插入链接",
                animation: "scale",
                content: UILink,
                handler: this
            });
    }

    /**
     * 点击超链接UI弹窗确认时回调
     * @param html 插入的html
     */
    recieveLinkHTML(html: string) {
        // 设置光标
        this.setRange();
        // 插入链接
        this.insertHTML(html);
        return true;
    }
    /**
     * 插入图片调起插入图片UI
     * @param e 事件
     */
    insertImage(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.canExecCMD() &&
            WindowComponent.showWindow({
                title: "插入文件",
                animation: "scale",
                content: UIAnnex,
                handler: this
            });
    }
    /**
     * 点击上传文件UI弹窗上传本地图片时回调
     * @param html 插入的html
     */
    recieveImageHTML(html: string) {
        this.setRange();
        this.insertHTML(html);
        return true;
    }
    /**
     * 点击上传文件UI弹窗“插入外链”时回调
     * @param html 插入的html
     */
    recieveOutLinkHTML(html: string) {
        this.setRange();
        this.insertHTML(html);
        return true;
    }


    /**
     * 插入hr
     */
    insertHorizontalRule(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("insertHorizontalRule", false, "");
    }

    /**
     * 粘贴
     */
    paste(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("paste", false, "");
    }

    /**
     * 剪切
     */
    cut(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("cut", false, "");
    }

    /**
     * 复制
     */
    copy(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("copy", false, "");
    }

    /**
     * 选中所有
     */
    selectAll(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("selectAll", false, "");
    }

    /**
     * 重做
     */
    redo(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("redo", false, "");
    }

    /**
     * 撤销
     */
    undo(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("undo", false, "");
    }

    /**
     * 删除选中
     */
    deleteSelect(e: any) {
        e = e || window.event;
        e.preventDefault(); this.edit(e);
        this.cmd("delete", false, "");
    }

    /**
     * 清除格式
     */
    removeFormat(e: any) {
        e = e || window.event;
        e.preventDefault(); 
        this.edit(e);
        // 选中文字清除格式
        this.cmd("removeFormat", false);
        // 未选中文字退出
        if (!this.getSelectionText()) return;
        this.formatBlock = "p";
        this.foreColor = "black";
        this.backColor = "white";
        this.fontSize = { key: "small", value: "3" };
        this.fontFamily = { key: "微软雅黑", value: "Microsoft Yahei" };
        this.setJustifyactive("left");
        this.setHistoryFormat();
    }

    /**
     * 发射编辑内容
     */
    @Emit('recieveContent')
    emitContent() {
        let size = 0;
        const editPannel = <any>this.pannel;
        // 检测编辑内容大小
        let innerHTML: string = editPannel.innerHTML;
        for (let i = 0, len = innerHTML.length; i < len; i++) {
            const c = innerHTML.charCodeAt(i);
            if (c > 0 && c < 255) {
                size++;
            } else {
                size += 2;
            }
        }
        if (size > this.options$.maxsize) {
            TipComponent.showTip({
                text: '编辑内容超出大小~'
            });
            innerHTML = innerHTML.substr(0, this.options$.maxsize);
        }
        const image = this.getUrlsByTag('img');
        const audio = this.getUrlsByTag('audio');
        const video = this.getUrlsByTag('video');
        return {
            innerHTML,
            innerTEXT: editPannel.textContent
                || editPannel.innerText,
            urls: {
                image,
                audio,
                video
            },
        };
    }
    /**
     * 根据标签找urls和base64的url
     * @param tag 标签类型
     */
    getUrlsByTag(tag: string) {
        const arr = [];
        const tags = (<any>this.pannel).getElementsByTagName(tag.toUpperCase());
        for (let tag of tags) {
            const item: any = {};
            const src = tag.src;
            if (src.indexOf('data:image/png;base64,') === -1) {
                item.type = 'url';
            } else {
                item.type = 'base64';
            }
            item.src = src;
            arr.push(item);
        }
        return arr;
    }

    /**
     * 执行封装的编辑命令
     * @param k 命令名称
     * @param ui 打开ui弹窗
     * @param v 设置命令值
     * @returns {boolean} true-设置成功，false-设置失败
     */
    cmd(k: string, ui: boolean, v?: any) {
        if('paste,cut,copy,delete,selectAll,removeFormat,redo,undo'.indexOf(k) < 0 && !this.canExecCMD())return false;
        document.execCommand(k, ui, v || "");
        return true;
    }

    /**
     * 如果在代码区内则弹窗提示设置无效
     * @returns {boolean} true - 可设置样式，false - 弹窗提示不可设置样式
     */
    canExecCMD(): boolean {
        this.setRange();
        if (this.isRangeInCode()) {
            TipComponent.showTip({
                text: '设置无效~'
            });
            return false;
        }
        return true;
    }

    /**
     * 判断光标是否在代码区内
     * @returns {boolean} true - 在代码区内，false - 不在代码区内
     */
    isRangeInCode(): boolean {
        const container: any = this.getRangeContainer();
        if (!container) return false;
        if (!container.end && !container.start) return false;
        if (!container.end.parentNode && !container.start.parentNode) return false;
        return container.end.parentNode.tagName === 'CODE'
            || container.start.parentNode.tagName === 'CODE'
            || container.end.parentNode.parentNode.tagName === 'CODE'
            || container.start.parentNode.parentNode.tagName === 'CODE';
    }

    /**
     * 获取光标开始和结束容器
     * @returns {} {start: Element, end: Element}|undefined
     */
    getRangeContainer(): { start: Element, end: Element } | undefined {
        const range = this.getSelectionRange();
        if (!range) return;
        return {
            start: range.startContainer,
            end: range.endContainer
        };
    }

    /**
     * 鼠标离开编辑项，面板隐藏
     * @param e 事件
     * @param who 面板隐藏标志
     */
    hidePannel(_e: any, who: any) {
        const e = _e || window.event;
        // 编辑项容器，绑定事件的元素
        const ct = e.currentTarget;
        // 鼠标离开进入的那个元素
        const rt = e.relatedTarget || e.toElement;
        // 编辑项容器不包含进入的那个元素，面板隐藏
        if (!this.contains(ct, rt)) (<any>this)[who] = false;
    }

    /**
     * 输入时记住光变位置 && input事件发射value
     */
    @Emit('input')
    saveLastRangeAndEmitValue(): string {
        this.saveLastRange();
        this.setHistoryFormat();
        return this.pannel.innerHTML;
    }

    /**
     * input,click,selectionchange事件记录编辑面板光标位置
     */
    saveLastRange() {
        this.pannel.lastRange = this.getSelectionRange();
    }

    /**
     * 确保编辑面板聚焦，设置编辑面板上次光标为当前光标
     * @param e
     */
    setRange() {
        const pannel: any = this.pannel;
        if (!pannel) return;
        // 确保编辑面板先是聚焦的
        if (document.activeElement !== pannel)
            pannel.focus();
        const lastRange = pannel.lastRange;
        if (!lastRange) { // 无上次光标，移动光标到末尾
            const s = this.getSelection();
            if (s) {
                s.selectAllChildren(pannel);
                s.collapseToEnd();
            }
            return;
        };
        this.setSelectionRange(lastRange);
    }

    /**
     * 获取选区range
     */
    getSelectionRange() {
        const selection: any = this.getSelection();
        if (!selection) return;

        //////////////////////////////////////////////////////////////////
        // if((<any>document).selection){ //旧标准
        //     if(e.value===undefined){ //没有value属性的html元素
        //         var range = selection;
        //         return range;
        //     }
        //     //只受用于一些含有value属性的HTML控件，例如单行文本框、多行文本域；
        //     return e.createTextRange();
        // }
        //////////////////////////////////////////////////////////////////

        //新标准
        if (selection.getRangeAt && selection.rangeCount) {
            return selection.getRangeAt(0);
        } else {
            //不支持getRangeAt的情况
            const range = document.createRange();
            range.setStart(selection.anchorNode, selection.anchorOffset);
            range.setEnd(selection.focusNode, selection.focusOffset);
            return range;
        }
    }

    /**
     * 设置选区range
     * @param r 选区range
     */
    setSelectionRange(r: any) {
        let selection = this.getSelection();
        if (!selection) return;
        if (selection.addRange) {
            // 新标准
            selection.removeAllRanges();
            selection.addRange(r);
            return;
        }
        // 旧标准
        selection = r;
    }

    /**
     * 获取用户选区
     */
    getSelection(): Selection | null {
        if (window.getSelection) {
            //新标准ie9+和其他浏览器
            return window.getSelection();
        } else if ((<any>document).selection) {
            //旧标准ie6、7、8
            return (<any>document).selection.createRange();
        }
        return null;
    }

    /**
     * 获取选区的内容
     */
    getSelectionText(): string | undefined {
        const s = this.getSelection();
        if (!s) return "";
        return s.toString() || (<any>s).text;
    }

    /**
     * 插入html并渲染
     * @param str html
     */
    insertHTML(str: string) {
        if (this.isSupport("insertHTML")) {
            this.cmd("insertHTML", false, str);
        } else {
            const r = this.insertAtCursor(this.pannel, str);
            if (r) return;
            TipComponent.showTip({
                text: "浏览器不支持~"
            });
        }
    }
    /**
     * 将光标设置到元素
     * @param e 元素
     */
    setRangeToElement(e: Element) {
        if (!e) return false;
        const range = this.getSelectionRange();
        const selection: any = this.getSelection();
        if (range.setStart) {
            range.selectNodeContents(e);
            //选区起点移动到选区终点位置，此时光标在lastNode中
            range.collapse(false);
            //先移除页面选区中所有range，再将range添加到选区中，
            selection.removeAllRanges();
            selection.addRange(range);
        } else if (
            (<any>document).selection &&
            (<any>document).selection.type != "Control"
        ) { // IE < 9
            range.moveToElementText(e);
            range.collapse(false);
            range.select();
        }
    }
    /**
     * 兼容insertHTML，向可编辑元素中插入html文本
     * @param elem 获取焦点的元素
     * @param html 要插入的html
     * @returns boolean false - 不支持
     */
    insertAtCursor(elem: any, html: string): boolean {
        var range = this.getSelectionRange();
        if (range.setStart) {
            // IE9 或 非IE浏览器
            range.deleteContents();
            //el相当于一个临时容器，主要作用就是将字符串变成节点
            const el = document.createElement("p");
            el.innerHTML = html;
            let frag = document.createDocumentFragment(),
                node,
                lastNode;
            while ((node = el.firstChild)) {
                //转移el中的节点到frag中来！！！直到node为空
                //node可能是元素和文本节点
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            elem = lastNode;
        } else if (
            (<any>document).selection &&
            (<any>document).selection.type != "Control"
        ) {
            // IE < 9
            range.pasteHTML(html); //如果是文本使用range.text += html
        } else {
            elem = null;
        }
        if (elem === null) return false;
        this.setRangeToElement(elem);
        return true;
    }

    /**
     * 判断p是否包含c
     * @param p 元素
     * @param c 元素
     */
    contains(p: any, c: any) {
        // 找p的所有子节点
        const childs = this.getAllChilds(p);
        for (let i = 0, len = childs.length; i < len; i++) {
            if (childs[i] === c) return true;
        }
        return false;
    }

    /**
     * 找元素的所有子节点
     * @param p
     */
    getAllChilds(p: any): any {
        const childs: any = [p];
        const recursion = (e: any) => {
            const ec = e.children;
            if (!ec) return;
            const len = ec.length;
            if (!len) return;
            for (let i = 0; i < len; i++) {
                const _e = ec[i];
                childs.push(_e);
                recursion(_e);
            }
        };
        recursion(p);
        return childs;
    }
}
