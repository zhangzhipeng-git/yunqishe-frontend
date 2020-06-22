import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Model } from 'vue-property-decorator';
@Component
export default class InputComponent extends Vue {
    /** placeholder */
    @Prop({default: ''})placeholder!: string;
    /** v-model */
    @Model('input')@Prop({default: ''})value!: string;
    /** input名称 */
    @Prop({default: ''})name!: string;
    /** input的类型 */
    @Prop({default: 'text'})type!: string;
    /** input的标签 */
    @Prop({default: ''})label!: any;
    /** 前提：使用自带的label；false - 水平式（label和input在一行），true-垂直式（label和input不在一行） */
    @Prop({default: false})vertical!: boolean;
    /** 正则 ，如果传入字符串则表示使用内置的对应的正则*/
    @Prop({default: null})pattern!: RegExp;
    /** 不匹配正则时对应的错误提示 */
    @Prop({default: null})error!: string;
    /** 是否多行，启用textarea */
    @Prop({default: false})multiple!: boolean;
    /** 是否开启显示和隐藏 */
    @Prop({default: false})hasEye!: boolean;
    /** 是否显示清除icon */
    @Prop({default: false})hasX!: boolean;
    /** 是否显示编辑icon */
    @Prop({default: false})hasEdit!: boolean;
    /** input的id */
    id: string = 'input-component'+Math.random().toString().substr(2);
    /** 是否满足正则匹配 true-不满足，false-满足*/
    showError: boolean = false;
    /** 不匹配正则时，用于显示在页面上的错误信息 */
    errorText: string = '';
    /** 本组件内部正则集合 */
    static innerReg = {
        /** ip地址 */
        ip : {reg: /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/, tip: 'ip格式不正确'},
        /** QQ */
        QQ: {reg: /^[1-9][0-9]{4,10}$/, tip: 'QQ号码格式不正确'},
        /** 链接 */
        url : {reg: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, tip: 'url格式不正确'},
        /** 名称 */
        name : {reg: /(^[a-z0-9_-]{4,16}$)|(^[\u2E80-\u9FFF]{2,5})/, tip: '名称格式不正确'},
        /** 邮箱 */
        email: {reg: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, tip: '邮箱格式不正确'},
        /** 手机或电话 */
        phone: {reg: /^[1][3,4,5,7,8][0-9]{9}$|^(([0+]d{2,3}-)?(0d{2,3})-)?(d{7,8})(-(d{3,}))?$/, tip: '手机或电话号码格式不正确'},
        /** 金额数字 */
        money: {reg: /(^[1-9]([0-9]{0,4})(\.[0-9]{1,2})$)|(^[1-9]([0-9]{0,4})$)|(^[0-9]\.[0-9]{1,2}$)/, tip: '金额格式不正确'},
        /** 微信账号 */
        wChat: {reg: /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/, tip: '微信号码格式不正确'},
        /** 数字 */
        number: {reg: /^-?\d*\.?\d+$/, tip: '数字格式不正确'},
        /** 身份证号 */
        idCard: {reg: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, tip: '身份证号码格式不正确'},
        /** 中文 */
        chinese: {reg: /^[\u2E80-\u9FFF]+$/,  tip: '必须为中文'},
        /** html标签 */
        htmlTag: {reg: /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/, tip: 'html标签格式不正确'},
        /** 必填 */
        required : {reg: /\S/, tip: '必填项，不能为空'},
        /** 普通密码 */
        password : {reg: /^[a-z0-9_-]{6,18}$/, tip: '密码在6~18位之间,且只能包含数字、字母、_和-'},
        /** 正数 */
        positive: {reg: /^\d*\.?\d+$/, tip: '必须为正数'},
        /** 负数 */
        negative: {reg: /^-\d*\.?\d+$/, tip: '必须为负数'},
        /** 强密码 */
        spasswrod : {reg: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/, tip: '密码强度过弱'},
        /** 电话 */
        cellPhone: {reg: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/, tip: '手机号码格式不正确'},
        /** 手机 */
        telePnone: {reg: /^(([0+]d{2,3}-)?(0d{2,3})-)?(d{7,8})(-(d{3,}))?$/, tip: '电话号码格式不正确'},
        /** 车牌号 */
        carPlante: {reg: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/, tip: '车牌号码格式不正确'}
    };

    // 获取v-model（不立即在页面显示错误信息）
    get value$() {
        const tip = this.getTip(this.value);
        // 发射通过状态
        this.$emit('pass', !tip);
        // 待挂载后设置表单校验状态
        this.$nextTick(() => {this.setFormResult(!tip);});
        return this.value;
    }

    // 输入时触发
    set value$(v: string) {
        this.$emit('input', v);
        // 设置错误信息、发射通过状态，设置表单校验状态
        const tip = this.getTip(v);
        this.setError(tip);
        this.$emit('pass', !tip);
        this.setFormResult(!tip);
    }
    
    constructor() {
        super();
    }

    /**
     * 获取错误提示，返回为null时表示没有错误
     * @param v v-model
     */
    getTip(v: string): string|null {
        if (v === undefined) v = '';
        let tip: string|null = null;
        let reg: RegExp|null = null;
        if (typeof this.pattern === 'string') {         // 使用内部正则匹配
            const regObj = (<any>InputComponent.innerReg[this.pattern]);
            reg = regObj.reg;
            tip = this.error || regObj.tip;
        } else if (typeof this.pattern === 'object') {  // 使用自定义正则匹配
            reg = this.pattern;
            tip = this.error;
        }
        if (reg && !reg.test(v)) {  // 有tip，说明有错误
            return tip;
        }
        return null;                // 没有tip，说明没有错误
    }

    /**
     * 设置错误提示
     * @param tip 错误提示
     */
    setError(tip: any) {
        this.errorText = tip;
        this.showError = !!tip;
    }

    /**
     * 设置表单校验结果，每次输入都会调用本函数
     * @param result 校验结果
     */
    setFormResult(result: boolean) {
        if (!this.formGroup) return;
        const key = this.name || this.id;
        let checkform: CheckForm = this.formGroup.checkForm;
        if (!checkform) { // 若没有表单验证
            this.formGroup.checkForm = {};
            checkform = this.formGroup.checkForm;
        };
        if (!checkform.inputs) { // 若表单验证没有添加input集合
            checkform.inputs = {};
        };
        const inputs = checkform.inputs;
        if (!inputs[key]) { // 若input集合没有当前组件的校验结果
            inputs[key] = {pass: false};
        };
        inputs[key].pass = result;
        let valid: boolean = true;
        const inputsValues = Object.values(inputs);
        for (let i = 0, len = inputsValues.length; i < len; i++) {
            const pass = (<any>inputsValues[i]).pass;
            if (!pass) { // 有一个未通过就停止验证
                checkform.valid = false;
                checkform.invalid = true;
                return;
            }
            valid = valid&&pass;
        }
        // 最后校验结果
        checkform.valid = valid;
        checkform.invalid = !valid;
    }

    /**
     * 获取本组件的父表单容器
     * form标签或添加了'formgroup'的标签
     */
    get formGroup(): any|null {
        if (!this.$el) return null;
        let node = (<any>this.$el).parentNode;
        while(node && node.tagName !== 'FORM' && node.getAttribute('formgroup') == undefined && node.tagName !== 'BODY') {
            node = node.parentNode;
        }
        if (node && node.tagName === 'BODY') {
            return null;
        };
        return node;
    }
}

/**
 * 表单验证数据结构
 */
declare interface CheckForm {
    /** input 校验结果集合，键值对，键默认为inputcomponent的默认id，值为pass，类型boolean，表示单个的input校验状态 */
    inputs: {[key: string]: Input};
    /** 是否无效，true-无效，false-有效 */
    invalid: boolean;
    /** 是否有效，false-无效，true-有效 */
    valid: boolean;
}

declare interface Input {
    pass: boolean;
}