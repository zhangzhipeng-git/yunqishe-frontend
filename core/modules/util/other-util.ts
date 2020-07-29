export default class CommonUtil {

    /**
     * 判断版本号v1是否大于v2
     * @param v1 
     * @param v2 
     */
    public static compareVersion(v1: string, v2: string) {
        if (!v1||!v2) return false;
        v1 = v1.replace(/\.0*/g, '');
        v2 = v2.replace(/\.0*/g, '');
        const v1len = v1.length;
        const v2len = v2.length;
        const len = Math.abs(v1len-v2len);
        const suf = new Array(len).join('0');
        if (v1len > v2len) v2+=suf;
        if (v1len < v2len) v1+=suf;
        return Number(v1) > Number(v2);
    }
}