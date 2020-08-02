/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\core\modules\components\commons\editor\ui-annex\ui-annex.ts
 * Created Date: Saturday, February 22nd 2020, 8:16:01 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 上传文件弹出层
 * Last Modified: Sunday August 2nd 2020 7:17:07 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

import Vue from "vue";
import Component from "vue-class-component";
import { Radio } from "../_form/radio-group/radio-group";
import RadioGroupComponent from "../_form/radio-group/radio-group.vue";
import TipComponent from "../_alert/tip/tip"; // 提示弹窗
import { Watch } from "vue-property-decorator";
@Component({
    components: {
        RadioGroupComponent
    }
})
export default class UIAnnexComponent extends Vue {
    url: string = "https://";
    width: string = "100%";
    height: string = "200px";
    type: 'image' | 'audio' | 'video' = "image";
    /** 获取类型对应的名称 */
    typeName: string = '图片';
    radioGroup: Radio[] = [{ value: "image", text: "图片" }, { value: "audio", text: "音频" }, { value: "video", text: "视频" }];
    /** 图片类型 */
    static IMAGEARR = ["image/gif", "image/jpeg", "image/jpg", "image/png", "image/svg"];
    static AUDIOARR = ["audio/mp3", "audio/ogg", "audio/wav"];
    static VIDEOARR = ["video/mp4", "video/ogg", "video/webm"];
    constructor() {
        super();
    }
    /**
     * 观测type变化
     * @param nv type的新值
     * @param ov type的旧值
     */
    @Watch('type')
    watchType(nv: any, ov: any) {
        if (nv === 'audio') {
            this.width = '300px';
            this.height = '30px';
            this.typeName = '音频';
        } else if (nv === 'video') {
            this.width = '400px';
            this.height = '200px';
            this.typeName = '视频';
        } else if (nv === 'image') {
            this.typeName = '图片';
        }
    }

    /**
     * 点击本地上传
     */
    selectFile() {
        // 需要先设置宽度和高度
        const num = /^[1-9]\d{1,3}(px|rem|em|vw|vh|%)?$/i;
        if (!num.test(this.width + "") || !num.test(this.height + "")) {
            TipComponent.showTip({
                text: `上传${this.typeName}前请填写合适的高度和宽度~`
            });
            return;
        }
        const file: any = this.$refs.file;
        const arr = {
            image: UIAnnexComponent.IMAGEARR,
            audio: UIAnnexComponent.AUDIOARR,
            video: UIAnnexComponent.VIDEOARR,
        }[this.type];
        file.accept = arr.join(",");
        file.click();
        file.onchange = this.fileChange;
    }

    /**
     * 选择文件
     */
    fileChange() {
        const files = (<any>this.$refs.file).files;
        const file = files[0];
        if (!files.length) return;
        // 编辑器实例
        const handler: any = this.$attrs.handler;
        // 获取编辑器banner配置参数
        const option = handler.options$[this.type];
        // 标签
        const tag = { 'image': 'IMG', 'audio': 'AUDIO', 'video': 'VIDEO' }[this.type];
        // 判断文件是否超过数量
        if (handler.$refs.edit_pannel.getElementsByTagName(tag).length === option.count) {
            TipComponent.showTip({
                text: `${this.typeName}已超出最大数量`
            });
            return;
        }
        // 判断图片是否需转成base64
        const base64size = option.base64;
        if (base64size && file.size <= base64size) {
            // 转成base64
            const fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = (event: any) => {
                if (handler.recieveLocalFileHTML(this.getImageHTML(event.target.result))) {
                    (<any>this.$parent).close();
                }
            };
        } else {
            // 交给外部进行处理
            handler.emitUploadFile && handler.emitUploadFile(this.type, file);
        }
    }
    /**
     * 插入外链
     */
    insertOutLink() {
        const hasperc = /^[1-9]\d{1,3}(px|rem|em|vw|vh|%)?$/i;
        if (!hasperc.test(this.width)) {
            TipComponent.showTip({
                text: "请填写合适的宽度~"
            });
            return;
        }
        if (!hasperc.test(this.height)) {
            TipComponent.showTip({
                text: '请填写合适的高度~'
            });
            return;
        }
        if (!/^(\/\/|https?:)\/\/.+/.test(this.url)) {
            TipComponent.showTip({
                text: "链接地址不规范"
            });
            return;
        }
        let html = "";
        const type = this.type;
        switch (type) {
            case "image":
                html = this.getImageHTML(this.url);
                break;
            case "audio":
                html = this.getAudioHTML(this.url);
                break;
            case "video":
                html = this.getVideoHTML(this.url);
                break;
        }
        if ((<any>this.$attrs.handler).recieveFileLinkHTML(html))
            (<any>this.$parent).close();
    }

    /**
     * 获取插入图片的HTML
     * @param src url或base64
     */
    getImageHTML(src: string) {
        return (
            '<p style="height:' +
            this.height +
            ';">' +
            '<img src="' +
            src +
            '" style="height:' +
            this.height +
            ';width:' +
            this.width +
            ';object-fit:cover;" />' +
            "</p>"
        );
    }
    /**
     * 获取插入音频的HTML
     * @param src url
     */
    getAudioHTML(src: string) {
        const arr = UIAnnexComponent.AUDIOARR;
        let html = '<p style="text-align:center;height:' + this.height + ';"><audio controls style="display:inline-block;height:' + '100%' + ';width:' + this.width + ';">'
        for (let i = 0, len = arr.length; i < len; i++) {
            html += '<source src="' + src + '" type="' + arr[i] + '">';
        }
        html += '您的浏览器不支持Audio标签。';
        html += '</audio>&#8205;&zwj;</p><br/>';
        return html;
    }

    /**
    * 获取插入视频的HTML
    * @param src url
    */
    getVideoHTML(src: string) {
        const arr = UIAnnexComponent.VIDEOARR;
        let html = '<p style="text-align:center;height:' + this.height + ';"><video controls style="display:inline-block;height:' + '100%' + ';width:' + this.width + ';">'
        for (let i = 0, len = arr.length; i < len; i++) {
            html += '<source src="' + src + '" type="' + arr[i] + '">';
        }
        html += '您的浏览器不支持Video标签。';
        html += '</video>&#8205;&zwj;</p><br/>';
        return html;
    }
}
