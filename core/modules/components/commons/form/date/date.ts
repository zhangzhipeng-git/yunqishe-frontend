import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Model } from 'vue-property-decorator';
@Component
export default class CalendarComponent extends Vue {
    /** id */
    @Prop({default: null})id!: string;
    /** 默认在input下方展示面板，为true时在input上方 */
    @Prop({default: false})reverse!: string;
    /** 日期 */
    @Prop({default: ''})@Model('input')date!: string;
    /** 日期格式化 */
    @Prop({default: 'yyyy-MM-dd'})pattern!: string;
    /** date副本 */
    date$: string = '';
    /** 面板是否显示 */
    show: boolean = false;
    /** 年份 */
    year: string = '';
    /** 月份 */
    month: string = '';
    /** 日期 */
    day: string = '';
    /** 周 */
    heads: string[] = ['日', '一', '二', '三', '四', '五', '六'];
    /** 周集合 */
    weeks: any[][] = [];

    constructor() {
        super();
    }

    beforeMount(): void {
        if (this.isDate(this.date)) { // 传入了合规的日期字符串，回显日期和初始化日期面板的日期
            this.date$ = this.date;
            Object.assign(this, this.getDate(this.date));
        } else { // 没有传入日期或传入无效日期，初始化日历面板日期为当前日期，不在input中显示！！
            Object.assign(this, this.getDate());
        }
        this.setWeeks();
    }
    /**
     * 设置日历面板
     */
    setWeeks() {
        const year = Number(this.year);
        const month = Number(this.month);
        const days = this.getMothDays(year, month); // 本月天数
        const pdays = this.getMothDays(year, month - 1); // 上月天数
        const fisrtDayInWeek = this.getDayInWeek(year, month, 1) // 本月第一天的周下标
        const lastDayInWeek = this.getDayInWeek(year, month, days); // 本月最后一天的周下标
        const dayArr = [];
        // 上月在本月的排列
        for(var i=0;i<fisrtDayInWeek;i++){
            dayArr.push({
                dayNum:pdays-fisrtDayInWeek+1+i,
                month:'previousMonth',
            });
        }
        //本月的排列
        for(var i=1;i<=days;i++){
            dayArr.push({
                dayNum:i,
                month:'thisMonth',
            });
        }
        //下月在本月中的排列
        for(var i=1;i<7-lastDayInWeek;i++){
            dayArr.push({
                dayNum:i,
                month:'nextMonth',
            });
        };
        let arr = [];
        this.weeks = [];
        for (let i = 1, len = dayArr.length+1; i < len; i++) {
            arr.push(dayArr[i-1]);
            if(i % 7 === 0) {
                this.weeks.push(arr);
                arr = [];
            }
        }
    }

    /**
     * 上一年
     */
    preYear() {
        let year = Number(this.year);
        year--;
        if (year < 0) year = 0;
        let year$ = year + '';
        const len = year$.length;
        if(len<4){
            var add0Len = 4-len;
            for(var i=0;i<add0Len;i++){
                year$ = '0'+ year$;
            }
        }
        this.year = year$;
        this.day = '';
        this.setWeeks();
    }

    /**
     * 上一月
     */
    preMonth() {
        let month = Number(this.month);
        month--;
        if (month === 0) {
            this.preYear();
            this.month = '12';
        } else {
            if ((month+'').length === 1) {
                this.month = '0' + month;
            } else {
                this.month = month+'';
            }
        }
        this.day = '';
        this.setWeeks();
    }

    /**
     * 下一年
     */
    nexYear() {
        let year = Number(this.year);
        year++;
        this.year = year+'';
        this.day = '';
        this.setWeeks();
    }

    /**
     * 下一月
     */
    nexMonth() {
        let month = Number(this.month);
        month++;
        if (month === 13) {
            this.nexYear();
            this.month = '01';
        } else {
            if ((month+'').length === 1) {
                this.month = '0' + month;
            } else {
                this.month = month+'';
            }
        }
        this.day = '';
        this.setWeeks();
    }

    /**
     * 选择天
     * @param day 某年某年的某天
     */
    selectDay(day: any) {
        const dayNum = day.dayNum+'';
        this.day = dayNum.length === 1 ? '0' + dayNum : dayNum;
        this.setAndEmitDate();
    }

    /**
     * 关闭
     */
    close() {
        this.show = false;
    }

    /**
     * 清空
     */
    clear() {
        this.day = '';
        this.date$ = '';
        this.$emit('input', '');
    }

    /**
     * 现在
     */
    now() {
        this.show = false;
        Object.assign(this, this.getDate());
        this.setAndEmitDate();
    }

    /**
     * 获取某年某月的天数
     * @param year 年
     * @param moth 月
     */
    getMothDays(year: number, moth: number) {
        return new Date(year, moth, 0).getDate();
    }

    /**
     * 获取某年某月某日在一周中的位置（0~6上周日到本周六）
     * @param year 年
     * @param month 月
     * @param day 日
     */
    getDayInWeek(year: number, month: number, day: number) {
        return new Date(year, month - 1, day).getDay();
    }

    /**
     * 面板展现于隐藏
     */
    toggle() {
        this.show = !this.show;
    }

    /**
     * input失焦，判断输入的日期是否正确，正确则发射日期
     */
    blur() {
        if (this.isDate(this.date$)) { // input中的日期合规，发射且设置日历面板日期为input的日期
            const {year, month, day} = this.getDate(this.date$);
            Object.assign(this, {year, month, day});
            this.setAndEmitDate();
            return;
        }
        // 不合规则清除显示
        this.date$ = '';
        this.show = false;
        this.$emit('input', '');
    }

    /**
     * 日期是否合规
     * @param date 日期字符串
     * @returns boolean true - 合规，false - 不合规
     */
    isDate(date: string) : boolean {
        const {year, month, day} = this.getDate(date);
        return year !== 'NaN' && month !== 'NaN' && day !== 'NaN';
    }

    /**
     * 根据合规的日期字符串返回year，month，day对象
     * @param date? 日期字符串，不传时返回当前日期部分（year，month，day对象）
     */
    getDate(date?: string): any {
        const date$ = date ? new Date(date) : new Date();
        const year = date$.getFullYear()+'';
        let month = date$.getMonth() + 1 + '';
        let day = date$.getDate() + '';
        month = month.length === 1 ? '0' + month : month;
        day = day.length === 1 ? '0' + day : day;
        return {year, month, day};
    }

    /** 设置日期并发射*/
    setAndEmitDate() {
        const date = this.pattern.replace(/yyyy/g, this.year).replace(/MM/g, this.month).replace(/dd/g, this.day);
        this.show = false;
        this.date$ = date;
        this.$emit('input', date);
    }
}