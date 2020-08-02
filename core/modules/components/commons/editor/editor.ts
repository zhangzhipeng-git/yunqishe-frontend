/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\core\modules\components\commons\editor\editor.ts
 * Created Date: Saturday, February 22nd 2020, 8:16:01 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 富文本编辑器
 * Last Modified: Sunday August 2nd 2020 5:49:29 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

import Vue from "vue";
import { Prop, Model, Ref, Watch } from "vue-property-decorator";
import Component from "vue-class-component";
import TipComponent from "./_alert/tip/tip";            // 提示弹窗
import WindowComponent, { WindowOptions } from "./_alert/window/window";   // 窗体弹窗
import UILink from "./ui-link/ui-link.vue";             // 超链接UI
import UITable from "./ui-table/ui-table.vue";          // 表格UI
import UIAnnex from "./ui-annex/ui-annex.vue";          // 附件UI
import Util from "./util";
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
    };
    /** 上传视频的配置参数 */
    video: {
        /** 上传的最大视频数量 */
        count: number;
    };
    /** 上传音频的配置参数 */
    music: {
        /** 上传的最大音频数量 */
        count: number;
    };
}
@Component
export default class EditorComponent extends Vue {
    /** v-model */
    @Model('input')
    @Prop({ type: String, default: '<p>请输入内容~</p>' }) vhtml!: string;
    /** 是否有按钮 */
    @Prop({ type: Boolean, default: false }) hasBtn!: boolean;
    /** 配置参数，应该从后台查配置参数 ！！！*/
    @Prop({ default: () => { } }) options!: Options;
    /** 编辑面板 */
    @Ref('pannel') pannel!: any;
    /** 字体样式 */
    fontFamilys = [{ key: "arial", value: "arial" }, { key: "微软雅黑", value: "Microsoft Yahei" }, { key: "宋体", value: "SimSun" }, { key: "黑体", value: "SimHei" }, { key: "楷体", value: "KaiTi" }, { key: "宋体", value: "SimSun" }, { key: "新宋体", value: "NSimSun" }, { key: "仿宋", value: "FangSong" }, { key: "微软正黑体", value: "Microsoft JhengHei" }, { key: "华文琥珀", value: "STHupo" }, { key: "华文彩云", value: "STCaiyun" }, { key: "幼圆", value: "YouYuan" }, { key: "华文行楷", value: "STXingkai" }];
    /** 文本格式 */
    formatBlocks = [{ key: "p", value: '<p data-index="0">p</p>' }, { key: "h6", value: '<h6 data-index="1">h6</h6>' }, { key: "h5", value: '<h5 data-index="2">h5</h5>' }, { key: "h4", value: '<h4 data-index="3">h4</h4>' }, { key: "h3", value: '<h3 data-index="4">h3</h3>' }, { key: "h2", value: '<h2 data-index="5">h2</h2>' }, { key: "h1", value: '<h1 data-index="6">h1</h1>' }];
    /** 颜色 */
    colors = [["#ffffff", "#000000", "#eeece1", "#1f497d", "#4f81bd", "#c0504d", "#9bbb59", "#8064a2", "#4bacc6", "#f79646"], ["#f2f2f2", "#7f7f7f", "#ddd9c3", "#c6d9f0", "#dbe5f1", "#f2dcdb", "#ebf1dd", "#e5e0ec", "#dbeef3", "#fdeada"], ["#d8d8d8", "#595959", "#c4bd97", "#8db3e2", "#b8cce4", "#e5b9b7", "#d7e3bc", "#ccc1d9", "#b7dde8", "#fbd5b5"], ["#bfbfbf", "#3f3f3f", "#938953", "#548dd4", "#95b3d7", "#d99694", "#c3d69b", "#b2a2c7", "#92cddc", "#fac08f"], ["#a5a5a5", "#262626", "#494429", "#17365d", "#366092", "#953734", "#76923c", "#5f497a", "#31859b", "#e36c09"], ["#7f7f7f", "#0c0c0c", "#1d1b10", "#0f243e", "#244061", "#632423", "#4f6128", "#3f3151", "#205867", "#974806"], ["#c00000", "#ff0000", "#ffc000", "#ffff00", "#92d050", "#00b050", "#00b0f0", "#0070c0", "#002060", "#7030a0"]];
    /** 字体大小 */
    fontSizes = [{ key: "xx-small", value: "1" }, { key: "x-small", value: "2" }, { key: "small", value: "3" }, { key: "medium", value: "4" }, { key: "large", value: "5" }, { key: "x-large", value: "6" }, { key: "xx-large", value: "7" }];
    /** code */
    codes = ['Html', 'Css', 'Js', 'TypeScript', 'Sass', 'Java', 'Xml', 'Sql', 'Shell'];
    /** 选中的字样 */
    fontFamily: any = { key: "微软雅黑", value: "Microsoft Yahei" };
    /** 选中的字号 */
    fontSize: any = { key: "small", value: 3 }; // 默认1rem;
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
    /** 默认左对齐 */
    justifyActive = 'justifyLeft';
    /** 是否全屏 */
    full: boolean = false;
    /** window之前绑定的resize事件 */
    resize: any;
    /** 合并参数 */
    get options$() {
        return Object.assign({ maxsize: 65535, image: { count: 5, base64: 60000, } }, this.options);
    }
    /** 是否支持全屏 */
    get isSupportFullScreen() {
        if (process && process.server) { // 兼容nuxt-ssr
            return !false;
        }
        // @ts-ignore
        return !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('div').webkitRequestFullScreen);
    }
    /** 当输入值有值的时候，取消vhtml$的重新赋值，避免重新赋值导致光标丢失！！！ */
    /** 如果确实要重新输入绑定，请设置一次vhtml为空！！！ */
    vhtml$: string = '';
    /** 是否对vhtml$的重新赋值,默认true */
    reset: boolean = true;
    @Watch('vhtml')
    watchVHTML(nv: string, ov: string) {
        if (nv && this.reset) { // 重新输入绑定
            this.reset = false;
            this.vhtml$ = this.vhtml;
            return;
        }
        if (!nv) { // 标记需要重新输入绑定
            this.reset = true;
            this.vhtml$ = '';
        };
    }

    constructor() {
        super();
    }

    /** 记住windown的原来的resize事件 */
    mounted() {
        this.resize = window.onresize;
    }

    /**
     * 如果一开始就点击编辑条执行命令，则需要先将编辑面板聚焦！！！
     * 1.判断编辑面板是否聚焦，如果聚焦直接退出
     * 2.聚焦面板并获取上次光标位置,设置当前编辑样式
     */
    startEdit() {
        const editPannel: any = this.pannel;
        // 判断是否聚焦
        if (document.activeElement === editPannel) return;
        // 设置光标
        this.setRange();
        // 不在代码区 && 获取当前设置的格式，并重新设置
        this.setHistoryFormat();
    }

    /**
     * 隐藏各类下拉框
     * @param e 事件
     */
    hideSwitchPannel(e: any) {
        e = e || window.event;
        const target = e.target || e.srcElement;
        if(this.switchFontFamilyPannel && !Util.contains(this.$refs.fontName, target)) {
            this.switchFontFamilyPannel = false;
            return;
        }
        if(this.switchFontSizePannel && !Util.contains(this.$refs.fontSize, target)) {
            this.switchFontSizePannel = false;
            return;
        }
        if(this.switchForeColorPannel && !Util.contains(this.$refs.foreColor, target)) {
            this.switchForeColorPannel = false;
            return;
        }
        if(this.switchBackColorPannel && !Util.contains(this.$refs.backColor, target)) {
            this.switchBackColorPannel = false;
            return;
        }
        if(this.switchFormatBlockPannel && !Util.contains(this.$refs.formatBlock, target)) {
            this.switchFormatBlockPannel = false;
            return;
        }
        if(this.switchCodePannel && !Util.contains(this.$refs.code, target)) {
            this.switchCodePannel = false;
            return;
        }
    }

    /**
     * 设置历史格式
     */
    setHistoryFormat() {
        // 在代码区不设置文本格式
        if (this.isRangeInCode()) return;
        // 设置文本格式
        this.cmd(this.justifyActive, false, '');
        this.cmd("foreColor", false, this.foreColor);
        this.cmd("backColor", false, this.backColor);
        this.cmd('formatBlock', false, this.formatBlock);
        this.cmd("fontSize", false, this.fontSize.value);
        this.cmd("fontName", false, this.fontFamily.value);
    }

    /**
     * 确保编辑面板是聚焦的
     * @param e {Event} 事件对象
     */
    ensureFocus(e: any) {
        // 阻止失焦
        e = e || window.event;
        e.preventDefault();
        // 面板聚焦（已聚焦则不进行聚焦）
        this.startEdit();
    }

    /**
     * 设置字样
     * @param e 事件
     */
    setFontName(e: any) {
        this.ensureFocus(e);
        const t = e.target;
        const index = t.getAttribute("data-index");
        this.switchFontFamilyPannel = !this.switchFontFamilyPannel;
        if (index === null || index === undefined) return;
        this.fontFamily = this.fontFamilys[index * 1];
        this.cmd("fontName", false, this.fontFamily.value);
    }

    /**
     * 设置字号
     */
    setFontSize(e: any) {
        this.ensureFocus(e);
        const t = e.target;
        const index = t.getAttribute("data-index");
        this.switchFontSizePannel = !this.switchFontSizePannel;
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
        this.ensureFocus(e);
        const t = e.target;
        const index = t.getAttribute("data-index");
        this.switchFormatBlockPannel = !this.switchFormatBlockPannel;
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
        this.ensureFocus(e);
        const t = e.target;
        const x = t.getAttribute("data-dim1");
        const y = t.getAttribute("data-dim2");
        this.switchForeColorPannel = !this.switchForeColorPannel;
        if (x === null || y == null) return;
        this.foreColor = this.colors[x][y];
        this.cmd("foreColor", false, this.foreColor);
    }

    /**
     * 设置背景色(高亮色)
     * @param e 事件
     */
    setBackColor(e: any) {
        this.ensureFocus(e);
        const t = e.target;
        const x = t.getAttribute("data-dim1");
        const y = t.getAttribute("data-dim2");
        this.switchBackColorPannel = !this.switchBackColorPannel;
        if (x === null || y == null) return;
        this.backColor = this.colors[x][y];
        this.cmd("backColor", false, this.backColor);
    }

    /**
     * 设置代码语言
     * @param e 事件
     */
    insertCode(e: any) {
        if (this.isRangeInCode()) {
            this.toast('代码区无法插入代码区~');
            return;
        }
        this.ensureFocus(e);
        this.switchCodePannel = !this.switchCodePannel;
        const index = e.target.getAttribute('data-index');
        if (index === null) return;
        this.code = this.codes[index];
        const id = new Date().getTime()+'';
        let html = '<pre title="代码区" class="code '
            + this.code.toLowerCase() + '"><code class="'
            + this.code.toLowerCase() + '"><p id='+ id +'></br></p></code></pre><p></br></p>';
        this.removeFormat(e);
        this.insertHTML(html);
        // 插入html后，将光标移至代码区的p标签中
        this.setSelectionToElement(document.getElementById(id));
    }

    /**
     * 设置粗体
     */
    switchBold(e: any) {
        this.ensureFocus(e);
        this.cmd("bold", false, "");
    }

    /**
     * 设置斜体
     */
    switchItalic(e: any) {
        this.ensureFocus(e);
        this.cmd("italic", false, "");
    }

    /**
     * 设置下划线
     */
    switchUnderline(e: any) {
        this.ensureFocus(e);
        this.cmd("underline", false, "");
    }

    /**
     * 设置删除线
     */
    switchStrikeThrough(e: any) {
        this.ensureFocus(e);
        this.cmd("strikeThrough", false, "");
    }

    /**
     * 设置上标
     */
    superscript(e: any) {
        this.ensureFocus(e);
        this.cmd("superscript", false, "");
    }

    /**
     * 设置下标
     */
    subscript(e: any) {
        this.ensureFocus(e);
        this.cmd("subscript", false, "");
    }

    /**
     * 设置setJustifyactive
     * @param justifyActive 
     */
    setJustifyactive(justifyActive: string) {
        this.justifyActive = justifyActive;
    }
    /**
     * 居左
     */
    justifyLeft(e: any) {
        this.ensureFocus(e);
        this.setJustifyactive("justifyLeft");
        this.cmd("justifyLeft", false, "");
    }

    /**
     * 居左
     */
    justifyRight(e: any) {
        this.ensureFocus(e);
        this.setJustifyactive("justifyRight");
        this.cmd("justifyRight", false, "");
    }

    /**
     * 居左
     */
    justifyCenter(e: any) {
        this.ensureFocus(e);
        this.setJustifyactive("justifyCenter");
        this.cmd("justifyCenter", false, "");
    }

    /**
     * 居左
     */
    justifyFull(e: any) {
        this.ensureFocus(e);
        this.setJustifyactive("justifyFull");
        this.cmd("justifyFull", false, "");
    }

    /**
     * 缩进
     */
    indent(e: any) {
        this.ensureFocus(e);
        this.cmd("indent", false, "");
    }

    /**
     * 减少缩进
     */
    outdent(e: any) {
        this.ensureFocus(e);
        this.cmd("outdent", false, "");
    }

    /**
     * 插入有序列表
     */
    insertOrderedList(e: any) {
        this.ensureFocus(e);
        this.cmd("insertOrderedList", false, "");
    }

    /**
     * 插入无序列表
     */
    insertUnorderedList(e: any) {
        this.ensureFocus(e);
        this.cmd("insertUnorderedList", false, "");
    }

    /**
     * 插入表格调起插入表格UI
     */
    insertTable(e: any) {
        this.ensureFocus(e);
        if (this.isRangeInCode()) {
            this.toast('代码区无法插入表格~');
            return;
        }
        this.alert({
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
        this.ensureFocus(e);
        if (this.isRangeInCode()) {
            this.toast('代码区无法插入链接~');
            return;
        }
        this.alert({
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
    insertFile(e: any) {
        this.ensureFocus(e);
        if (this.isRangeInCode()) {
            this.toast('代码区无法插入文件~');
            return;
        }
        this.alert({
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
    recieveLocalFileHTML(html: string) {
        this.setRange();
        this.insertHTML(html);
        return true;
    }
    /**
     * 点击上传文件UI弹窗“插入外链”时回调
     * @param html 插入的html
     */
    recieveFileLinkHTML(html: string) {
        this.setRange();
        this.insertHTML(html);
        return true;
    }
    /** 发射选择文件事件 */
    emitUploadFile(type: 'image' | 'audio' | 'video', file: any) {
        this.$emit('uploadFile', { type, file });
    }

    /**
     * 插入hr
     */
    insertHorizontalRule(e: any) {
        this.ensureFocus(e);
        this.cmd("insertHorizontalRule", false, "");
    }

    /**
     * 粘贴
     */
    paste(e: any) {
        this.ensureFocus(e);
        this.cmd("paste", false, "");
    }

    /**
     * 剪切
     */
    cut(e: any) {
        this.ensureFocus(e);
        this.cmd("cut", false, "");
    }

    /**
     * 复制
     */
    copy(e: any) {
        this.ensureFocus(e);
        this.cmd("copy", false, "");
    }

    /**
     * 选中所有
     */
    selectAll(e: any) {
        this.ensureFocus(e);
        this.cmd("selectAll", false, "");
    }

    /**
     * 重做
     */
    redo(e: any) {
        this.ensureFocus(e);
        this.cmd("redo", false, "");
    }

    /**
     * 撤销
     */
    undo(e: any) {
        this.ensureFocus(e);
        this.cmd("undo", false, "");
    }

    /**
     * 删除选中
     */
    deleteSelect(e: any) {
        this.ensureFocus(e);
        this.cmd("delete", false, "");
    }

    /**
     * 清除格式
     */
    removeFormat(e: any) {
        // 未选中文字退出
        if (!this.getSelectionText()) {
            return
        };
        this.ensureFocus(e);
        // 选中文字清除格式
        this.cmd("removeFormat", false);
        this.formatBlock = "p";
        this.foreColor = "black";
        this.backColor = "white";
        this.fontSize = { key: "small", value: "3" };
        this.fontFamily = { key: "微软雅黑", value: "Microsoft Yahei" };
        this.setJustifyactive("justifyLeft");
        this.setHistoryFormat();
    }

    /**
     * 获取历史输入
     */
    history() {
        this.vhtml$ = window.localStorage.getItem('editor_input') || '';
    }

    /**
     * 全屏或取消全屏
     */
    fullScreen() {
        const editor: any = this.$refs.editor;
        const pannel: any = this.$refs.pannel;
        if (this.full) { // 还原
            this.full = false;
            editor.style.cssText = '';
            pannel.style.cssText = '';
            // 恢复window上之前监听的resize事件
            window.onresize = this.resize;
            const doc: any = document;
            if (doc.exitFullscreen) doc.exitFullscreen();
            else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
            else if (doc.webkitCancelFullScreen) doc.webkitCancelFullScreen();
            else if (doc.msExitFullscreen) doc.msExitFullscreen();

        } else {        // 全屏
            this.full = true;
            if (editor.requestFullscreen) editor.requestFullscreen();
            else if (editor.mozRequestFullScreen) editor.mozRequestFullScreen();
            else if (editor.webkitRequestFullScreen) editor.webkitRequestFullScreen();
            else if (editor.msRequestFullscreen) editor.msRequestFullscreen();
            const header: any = this.$refs.header;
            const footer: any = this.$refs.footer;
            const height = (window.innerHeight - (header.offsetHeight + footer.offsetHeight));
            editor.style.cssText = 'position:fixed;z-index:9999999999;top:0;left:0;width:100%;height:100%';
            pannel.style.cssText = 'max-height:unset;height:' + height + 'px';
            // 全屏后监听窗口还原事件
            window.onresize = this.minimize;
        }
    }
    /**
     * 还原窗口
     */
    minimize() {
        if (this.full) {
            this.full = false;
            (<any>this.$refs.editor).style.cssText = '';
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
     * 执行封装的编辑命令
     * @param k 命令名称
     * @param ui 打开ui弹窗
     * @param v 设置命令值
     * @returns {boolean} true-设置成功，false-设置失败
     */
    cmd(k: string, ui: boolean, v?: any) {
        if (!this.isSupport(k)) {
            this.toast('系统不支持该命令~');
            return false;
        }
        if ('paste,cut,copy,delete,selectAll,removeFormat,redo,undo'.indexOf(k) < 0 && this.isRangeInCode()) {
            this.toast('代码区内无法执行该命令~');
            return false;
        }
        return document.execCommand(k, ui, v || "");
    }

    /**
     * 发射编辑内容
     */
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
            this.toast('编辑内容超出大小~');
            innerHTML = innerHTML.substr(0, this.options$.maxsize);
        }
        const image = this.getUrlsByTag('img');
        const audio = this.getUrlsByTag('audio');
        const video = this.getUrlsByTag('video');
        const obj = {
            innerHTML,
            innerTEXT: editPannel.textContent || editPannel.innerText,
            urls: {
                image,
                audio,
                video
            },
        };
        this.$emit('recieveContent', obj);
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
     * 判断光标是否在代码区内
     * @returns {boolean} true - 在代码区内，false - 不在代码区内
     */
    isRangeInCode(): boolean {
        this.startEdit();
        const container: any = this.getRangeContainer();
        if (!container) return false;
        if (!container.end && !container.start) return false;
        if (!container.end.parentNode && !container.start.parentNode) return false;
        return container.end.parentNode.tagName === 'CODE' || container.start.parentNode.tagName === 'CODE' || container.end.parentNode.parentNode.tagName === 'CODE' || container.start.parentNode.parentNode.tagName === 'CODE';
    }

    /**
     * 获取光标开始和结束容器
     * @returns {} {start: Element, end: Element}|undefined
     */
    getRangeContainer(): { start: Element, end: Element } | undefined {
        const range = this.getSelectionRange();
        if (!range) return;
        return { start: range.startContainer, end: range.endContainer };
    }

    /**
     * 输入时记住光变位置 && input事件发射value && 记住输入
     */
    saveLastRangeAndEmitValue() {
        this.saveLastRange();
        const innerHTML = this.pannel.innerHTML;
        if (this.vhtml$ === innerHTML) return;
        // 有内容且内容变化时才保存到本地
        if ((this.pannel.innerText || this.pannel.textContent).length > 1) {
            window.localStorage.setItem('editor_input', innerHTML);
        }
        this.$emit('input', innerHTML);
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
        if (document.activeElement !== pannel) {
            pannel.focus();
        }
        const lastRange = pannel.lastRange;
        if (!lastRange) { // 无上次光标，移动光标到末尾
            const s: any = this.getSelection();
            if (!s) return;
            if (s.selectAllChildren) { // 新标准
                s.selectAllChildren(pannel);
                s.collapseToEnd();
            } else { // 旧标准
               s.moveToElementText(pannel);
               s.collapse(true);
               s.select(); 
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
        //新标准
        if (selection.getRangeAt && selection.rangeCount) {
            return selection.getRangeAt(0);
        } else if (document.createRange) { // 没有范围时，创建一个
            const range = document.createRange();
            if (selection.anchorNode && selection.focusNode) {
                //不支持getRangeAt的情况
                range.setStart(selection.anchorNode, selection.anchorOffset);
                range.setEnd(selection.focusNode, selection.focusOffset);
            }
            return range;
        }
        // 旧标准 textRange 和 selection 一致
        const textRange = selection;
        textRange.select();
        return textRange;
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
        } else {
            // 旧标准，Selection为TextRange，直接赋值
            selection = r;
        }
    }

    /**
     * 获取用户选区
     */
    getSelection(): Selection | null {
        if (window.getSelection) {
            //新标准ie9+和其他浏览器
            return window.getSelection() || document.getSelection();
        } else {
            //旧标准ie6、7、8 旧标准 textRange 和 selection 一致
            return (<any>document).selection.createRange();
        }
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
        // 不支持insertHTML命令时
        if (!this.cmd("insertHTML", false, str)) {
            const r = this.insertAtCursor(this.pannel, str);
            if (r) return;
            this.toast('系统不支持~');
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
        if (!range) return false;
        if (range.setStart) { // 新标准
            // 删除选中的内容
            range.deleteContents();
            //el相当于一个临时容器，主要作用就是将字符串变成节点
            const el = document.createElement("p");
            el.innerHTML = html;
            let frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                //转移el中的节点到frag中来！！！直到node为空
                //node可能是元素和文本节点
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            elem = lastNode;
        } else if ((<any>document).selection && (<any>document).selection.type != "Control") {
            // ie < 9
            range.pasteHTML(html);
        }
        this.setSelectionToElement(elem);
        return true;
    }

    /**
     * 将光标设置到元素
     * @param e 元素
     */
    setSelectionToElement(e: Element | null) {
        if (!e) return false;
        const selection = this.getSelection();
        if (!selection) return;
        if (selection.setPosition) {
            selection.setPosition(e, 0);
        } else if ((<any>document).selection && (<any>document).selection.type != "Control") { // IE < 9
            const range: any = selection;
            range.moveToElementText(e);
            range.collapse(false);
            range.select();
        }
    }

    /**
     * toast提示
     * @param  {string} text? toast提示 默认为‘设置无效~’
     */
    toast(text: string = '设置无效~') {
        TipComponent.showTip({ text });
    }

    /**
     * 
     * @param obj 
     */
    alert(obj: WindowOptions) {
        WindowComponent.showWindow(obj);
    }

}
