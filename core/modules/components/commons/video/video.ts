import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch, Ref } from "vue-property-decorator";
import DomUtil from "~/core/modules/util/dom-util";

@Component
export default class VideoComponent extends Vue {
    /** 总时长,单位s,默认0 */
    duration: number = 0;
    /** 当前播放时间偏移量,单位s,默认0 */
    currentTime: number = 0;
    /** 已缓冲时长 0~总时长duration,默认0 */
    bufferedLength: number = 0;
    /** 音量 0~1,默认.8 */
    volume: number = .8;
    /** 播放速度,默认1.0即正常播放速率 */
    playbackRate: number = 1.0;
    /** 是否被暂停,默认true */
    paused: boolean = true;
    /** 暂停后恢复播放时渐变动画 */
    isInAnimation: boolean = false;
    /** 是否循环播放 */
    loop: boolean = false;
    /** 每一次的节流是否完成,默认true */
    throttleOver: boolean = true;
    /** 是否可播放 */
    canplay$: boolean = false;
    /** 鼠标放到了进度条上，默认false */
    hover: boolean = false;
    /** 鼠标悬浮在进度条上时，出现当前位置的时间 */
    hoverTime: number = 0;
    /** 是否显示音量调节条, 默认false */
    showVolumeBar: boolean = false;
    /** 是否全屏 */
    full: boolean = false;
    
    /** src播放地址 */
    @Prop({ type: String, default: "" })
    src!: string;
    /** 视频封面 */
    @Prop({ type: String, default: "" })
    poster!: string;
    /** 是否有上一个视频 */
    @Prop({ type: Boolean, default: false })
    hasPre!: boolean;
    /** 是否有下一个视频 */
    @Prop({ type: Boolean, default: false })
    hasNex!: boolean;
    /** 参数设置 */
    @Prop({ type: Object, default: () => { } })
    options!: object;
    options$: any = {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 是否自动播放
        preload: "metadata", // ‘auto’ - 页面加载后加载整个视频数据， ‘metadata’-仅加载视频信息而非整个视频文件加载元数据
        notSupportedMessage: "您的浏览器不支持video标签。", // 不支持的提示
        controls: false, // 控件
    };
    /**
     * 侦听参数设置输入
     * @param nv 新的输入
     */
    @Watch("options", { immediate: true, deep:true})
    watchOptions(nv: any) {
        Object.assign(this.options$, nv);
        this.paused = !this.options$.autoplay;
    }
    /**
     * 侦听src输入变化
     * @param nv 新输入
     */
    @Watch("src", { immediate: true})
    watchSrc(nv: any, ov: any) {
        if (ov !== nv) {
            this.duration = 0;
            this.hoverTime = 0;
            this.currentTime = 0;
            this.canplay$ = false;
            this.bufferedLength = 0;
            this.paused = !this.options$.autoplay;
        }
    }
    /** video标签 */
    @Ref("video")
    video!: HTMLVideoElement;

    /**
     * 检查是否支持video
     */
    get isSupport() {
        if (process && process.server) {
            return !false;
        }
        return !!document.createElement("video").canPlayType;
    }

    /** 是否支持全屏 */
    get isSupportFullScreen() {
        if (process && process.server) {
            return !false;
        }
        // @ts-ignore
        return !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
    }

    /**
     * 获取总时长字符串
     */
    get durationStr() {
        return this.time2str(this.duration);
    }

    /**
     * 获取已播放时长字符串
     */
    get currentTimeStr() {
        return this.time2str(this.currentTime);
    }

    /**
     * 获取鼠标悬浮在进度条上时，出现当前位置的时间的字符串
     */
    get hoverTimeStr() {
        return this.time2str(this.hoverTime);
    }

    /**
     * 获取按钮left
     */
    get btnLeft() {
        const currentTime = this.currentTime;
        const bar = (<any>this).$refs.bar;
        const barBtn = (<any>this).$refs.barBtn;
        if (!bar || !barBtn) return 0;
        const barWidth = bar.offsetWidth;
        // 只有显现时才能获取offsetWidth，其固定宽度为10PX
        const barBtnWidth = barBtn.offsetWidth||10;
        const rate = currentTime/this.duration;
        const value = (rate>1?1:rate)*barWidth;
        return this.getPositionValue(value, barBtnWidth, barWidth);
    }

    /**
     * 获取悬浮提示left
     */
    get hoverTipLeft() {
        const hoverTime = this.hoverTime;
        const bar = (<any>this).$refs.bar;
        const hoverTip = (<any>this).$refs.hoverTip;
        if (!bar || !hoverTip) return 0;
        const barWidth = bar.offsetWidth;
        const hoverTipWidth = hoverTip.offsetWidth;
        const value = (hoverTime/this.duration)*barWidth;
        return this.getPositionValue(value, hoverTipWidth, barWidth);
    }

    /**
     * 判断是否移动端，移动端不显示自定义controls
     */
    get isMB() {
        if (process&&process.server) return false;
        return /iphone|ipod|ios|android|BlackBerry|windows ce|windows mobile|webos|SymbianOS/i.test(navigator.userAgent);
    }

    /**
     * 获取音量滑动按钮bootom
     */
    get vbarBtnBottom() {
        const volume = this.volume;
        const vbar = (<any>this).$refs.vbar;
        const vbarBtn = (<any>this).$refs.vbarBtn;
        if (!vbar || !vbarBtn) return `${64*.8}PX`;
        const vbarHeight = vbar.offsetHeight;
        const vbarBtnHeight = vbarBtn.offsetHeight;
        const value = (volume/1)*vbarHeight;
        return this.getPositionValue(value, vbarBtnHeight, vbarHeight);
    }

    constructor() {
        super();
    }

    /**
     * 加载元数据
     */
    loadedmetadata() {
        // 发射视频宽高比例
        this.$emit("whRate", this.video.videoWidth / this.video.videoHeight);
        // 时长
        this.duration = this.video.duration - 1;
    }

    /**
     * 监听可以开始播放事件
     */
    canplay() {
        this.canplay$ = true;
    }

    /**
     * 客户端正在请求数据,缓冲读到浏览器内存里
     */
    progress() {
        const video = this.video;
        if(!video) return;
        const buffered = video.buffered;
        if (buffered.length === 0) return;
        // 获取最后一个缓冲段的结束时间，作为已缓冲长度
        this.bufferedLength = buffered.end(buffered.length-1);
        // 快进时长小于已缓冲时长时，可播放且不显示加载动画
        if (this.duration&&(this.currentTime<=this.bufferedLength)) {
            this.canplay$ = true;
        } else {
        // 快进时长大于已缓冲时长时，不可播放且显示加载动画
            this.canplay$ = false;
        }
    }

    /**
     * 播放
     */
    play() {
        if (!this.src) { // 还没传入src时点击播放，发射第一次播放事件
            this.$emit('firstPlay', this.video);
        }
        this.isInAnimation = true;
        this.paused = false;
        setTimeout(() => {
            this.video.play();
            this.isInAnimation = false;
        }, 300)
    }

    /**
     * 重放
     */
    replay() {
        this.video.currentTime = 0;
        this.play();
    }

    /**
     * 暂停
     */
    pause() {
        this.video.pause();
        this.paused = true;
        this.isInAnimation = false;
    }

    /**
     * 监听播放时间
     */
    timeupdate() {
        if (!this.video) return;
        // 播放结束
        if (this.video.ended){
            if (this.loop) {
                this.play();
            } else {
                this.pause();
            }
        };
        
        // 节流
        if (!this.throttleOver)return;
        this.throttleOver = false;
        setTimeout(() => {
            this.currentTime = this.video.currentTime>this.duration
            ?this.duration:this.video.currentTime;
            this.throttleOver = true;
        }, 60)
    }

    /**
     * 暂停或播放
     */
    switch$() {
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    /**
     * 跳转播放
     * @param e 点击事件
     */
    skip(e: any) {
        const x1 = DomUtil.getElementRect(this.$refs.bar)['left'];
        const x2 = e.clientX;
        let dis = x2 - x1;
        if(dis<0)dis=0;
        const rate = dis/(<any>this).$refs.bar.offsetWidth;
        this.currentTime =  this.duration*(rate>1?1:rate);
        this.video.currentTime = this.currentTime;
    }

    /**
     * 鼠标进入进度条
     */
    mouseenter() {
        this.hover = true;
    }

    /**
     * 鼠标移开进度条
     */
    mouseleave() {
        this.hover = false;
    }

    /**
     * 鼠标在进度条上悬浮移动
     */
    mousemove(e: any) {
        const x1 = DomUtil.getElementRect(this.$refs.bar)['left'];
        const x2 = e.clientX;
        let dis = x2 - x1;
        if (dis<0)dis=0;
        const rate = dis/(<any>this).$refs.bar.offsetWidth;
        this.hoverTime = this.duration*(rate>1?1:rate);
    }

     /** 点击开始移动 */
     start1(e: any) {
        const barBtn: any = this.$refs.barBtn;
        barBtn.ondragstart= () => false;
        DomUtil.addEvent(document, 'mousemove tochmove', this.move1);
        DomUtil.addEvent(document, 'mouseup tochend', this.end1);
        const start = {
            x: e.clientX||e.changedTouches[0].pageX,
            y:0
        }
        barBtn.start = start;
        barBtn.startTime = this.currentTime;
    }

    move1(e: any) {
        const barBtn: any = this.$refs.barBtn;
        const current = {
            x: e.clientX||e.changedTouches[0].pageX,
            y:0
        }
        const barWidth = (<any>this).$refs.bar.offsetWidth;
        // 当前点到点击点的距离
        const curx =  current.x - barBtn.start.x;
        // 相对点击点的播放偏移量
        let currentTime = barBtn.startTime + (curx/barWidth)*this.duration;
        // 防止播放时间越界
        if (currentTime > this.duration) currentTime = this.duration;
        else if (currentTime < 0) currentTime = 0;
        // 设置响应，变更视图
        this.currentTime = currentTime;
        this.video.currentTime = currentTime;
        
    }

    end1(e: any) {
        this.hover = false;
        const barBtn: any = this.$refs.barBtn;
        DomUtil.removeEvent(barBtn, 'mousedown tochstart', this.start1);
        DomUtil.removeEvent(document, 'mousemove tochmove', this.move1);
        DomUtil.removeEvent(document, 'mouseup tochend', this.end1);
    }

    switchVolume() {
        this.volume === 0?this.volume=1:this.volume=0;
        this.video.volume = this.volume;
    }

    /** 点击开始移动 */
    start2(e: any) {
        const vbarBtn: any = this.$refs.vbarBtn;
        vbarBtn.ondragstart= () => false;
        DomUtil.addEvent(document, 'mousemove tochmove', this.move2);
        DomUtil.addEvent(document, 'mouseup tochend', this.end2);
        const start = {
            x: 0,
            y:e.clientY||e.changedTouches[0].pageY
        }
        vbarBtn.start = start;
        vbarBtn.volume = this.volume;
    }

    move2(e: any) {
        const vbarBtn: any = this.$refs.vbarBtn;
        const current = {
            x: 0,
            y:e.clientY||e.changedTouches[0].pageY
        }
        const vbarHeight = (<any>this).$refs.vbar.offsetHeight;
        // 当前点到点击点的距离
        const cury = vbarBtn.start.y - current.y ;
        // 相对点击点的调节偏移量
        let volume = vbarBtn.volume + (cury/vbarHeight)*1;
        // 防止音量调节越界
        if (volume > 1) volume = 1;
        else if (volume < 0) volume = 0;
        // 设置响应，变更视图
        this.volume = volume;
        this.video.volume = volume;
        
    }

    end2(e: any) {
        this.hover = false;
        const vbarBtn: any = this.$refs.vbarBtn;
        DomUtil.removeEvent(vbarBtn, 'mousedown tochstart', this.start2);
        DomUtil.removeEvent(document, 'mousemove tochmove', this.move2);
        DomUtil.removeEvent(document, 'mouseup tochend', this.end2);
    }

    changeVolume(e: any) {
        const vbar:any = this.$refs.vbar;
        const y1 = DomUtil.getElementRect(vbar)['top'];
        const y2 = e.clientY;
        let dis = y2 - y1;
        if (dis<0)dis=0;
        const rate = dis/vbar.offsetHeight;
        this.volume = 1-1*(rate>1?1:rate);
    }

    fullScreen() {
        if (this.full) {
            const doc: any = document;
            if (document.exitFullscreen) document.exitFullscreen();
            else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
            else if (doc.webkitCancelFullScreen) doc.webkitCancelFullScreen();
            else if (doc.msExitFullscreen) doc.msExitFullscreen();
            this.full = false;
         }
         else {
            const videoContainer: any = this.$refs.figure;
            if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
            else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
            else if (videoContainer.webkitRequestFullScreen) videoContainer.webkitRequestFullScreen();
            else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
            this.full = true;
         }
    }

    /**
     * s -> 00:00:00
     * @param s 多少s
     */
    time2str(s: number) {
        const floor = Math.floor;
        const h = floor(s / 3600);
        const m = floor((s - 3600 * h) / 60);
        const S = Math.round(s - 3600 * h - 60 * m);
        const hstr = h.toString();
        const mstr = m.toString();
        const Sstr = S.toString();
        let str = (Sstr.length > 1 ? Sstr : "0" + Sstr);
        if (!0) {
            str = (mstr.length > 1 ? mstr : "0" + mstr) +':'+str;
        }
        if (h!==0) {
            str = (hstr.length > 1 ? hstr : "0" + hstr) +':'+str;
        }
        return str;
    }

    /**
     * 调控按钮或悬浮提示在总体进度范围之内
     * @param len1 当前进度
     * @param len2 进度调节按钮或悬浮提示占用进度的长度，如快进按钮的宽度和调节音量按钮的高度
     * @param len3 总体进度长度
     */
    getPositionValue(len1: number, len2: number, len3: number) {
        let v = 0;
        if (len1<=len2/2){
            v = 0;
        }else if (len1<=len3-len2/2) {
            v = len1-(len2/2);
        } else {
            v = len3 - len2;
        }
        return v + 'PX';
    }
}
