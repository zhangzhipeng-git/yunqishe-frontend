export default class DateUtil{

    /** 默认pattern */
    static DEFAULT_PATTERN = 'yyyy-MM-dd HH:mm:ss';

    constructor() {};

    /**
     * 根据pattern获取当前时间的字符串
     * @param p pattern {string} ? - 默认'yyyy-MM-dd HH:mm:ss'
     */
    public static now(p?: string): string {
        p = p || DateUtil.DEFAULT_PATTERN;
        const now = new Date();
        const year = now.getFullYear()+'';
        const month = (now.getMonth()+1)+'';
        const day = now.getDay()+'';
        const hour = now.getHours()+'';
        const minute = now.getMinutes()+'';
        const second = now.getSeconds()+'';
        return p.replace(/yyyy/g, year)
                .replace(/MM/g, month.length===1?'0'+month:month)
                .replace(/dd/g, day.length===1?'0'+day:day)
                .replace(/HH/g, hour.length===1?'0'+hour:hour)
                .replace(/mm/g, minute.length===1?'0'+minute:minute)
                .replace(/ss/g, second.length===1?'0'+second:second);
    }
    
}