/*
 * @Author: your name
 * @Date: 2020-01-05 22:04:23
 * @LastEditTime : 2020-01-10 21:52:18
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\components\commons\editor\ui-annex\ui-annex.ts
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
    type: string = "image";
    radioGroup: Radio[] = [
        { value: "image", text: "图片" },
        { value: "audio", text: "音频" },
        { value: "video", text: "视频" }
    ];
    /** 图片类型 */
    static IMGARR = [
        "image/gif",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/svg"
    ];
    static AUDIOARR = ["audio/mp3", "audio/ogg", "audio/wav"];
    static VIDEOARR = ["video/mp4", "video/ogg", "video/webm"];
    constructor() {
        super();
    }

    private mounted(): void {

    }
    /**
     * 观测type变化
     * @param _new type的新值
     * @param _old type的旧值
     */
    @Watch('type')
    watchType(_new: any, _old: any) {
        if (_new === 'audio') {
            this.width = '300px';
            this.height = '30px';
        } else if (_new === 'video') {
            this.width = '400px';
            this.height = '200px';
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
                text: "上传图片前请填写合适的高度和宽度~"
            });
            return;
        }
        const file: any = this.$refs.file;
        file.accept = UIAnnexComponent.IMGARR.join(",");
        file.click();
        file.onchange = this.fileChange;
    }

    /**
     * 选择文件
     */
    fileChange() {
        const file: any = this.$refs.file;
        const files = file.files;
        const img = files[0];
        if (!files.length) return;
        // 编辑器实例
        const handler: any = this.$attrs.handler;
        // 获取编辑器图片配置参数
        const imgOption = handler.options$.image;
        // 判断图片是否超过数量
        if (
            handler.$refs.edit_pannel.getElementsByTagName("IMG").length ===
            imgOption.count
        ) {
            TipComponent.showTip({
                text: "图片已超出最大数量"
            });
            return;
        }
        // 判断图片是否需转成base64
        const base64size = imgOption.base64;
        if (base64size && img.size <= base64size) {
            // 转成base64
            const fr = new FileReader();
            fr.readAsDataURL(img);
            fr.onload = (event: any) => {
                if (handler.recieveImageHTML(this.getImageHTML(event.target.result)))
                    (<any>this.$parent).close();
            };
        } else {
            const server = imgOption.server; // 图片服务器
            const enable = server.enable; // 服务器是否可用
            if (!enable) {
                TipComponent.showTip({
                    text: "文件过大,无法上传,请使用外链~"
                });
                return;
            } else {
                // to-do
            }
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
        if((<any>this.$attrs.handler).recieveOutLinkHTML(html))
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
            '" style="height:'+
            this.height+
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
        let html = '<p style="text-align:center;height:'+ this.height +';"><audio controls style="display:inline-block;height:'+'100%'+';width:'+this.width+';">'
        for (let i = 0, len = arr.length; i < len; i++) {
            html += '<source src="'+src+'" type="' +arr[i]+ '">';
        }
        html +='您的浏览器不支持Audio标签。';
        html += '</audio>&#8205;&zwj;</p><br/>';
        return html;
     }

     /**
     * 获取插入视频的HTML
     * @param src url
     */
    getVideoHTML(src: string) {
        const arr = UIAnnexComponent.VIDEOARR;
        let html = '<p style="text-align:center;height:'+ this.height +';"><video controls style="display:inline-block;height:'+'100%'+';width:'+this.width+';">'
        for (let i = 0, len = arr.length; i < len; i++) {
            html += '<source src="'+src+'" type="' +arr[i]+ '">';
        }
        html +='您的浏览器不支持Video标签。';
        html += '</video>&#8205;&zwj;</p><br/>';
        return html;
     }
}
