export default class ENV {
    /** 全局引用 */
    static god: any = (typeof window !== 'undefined'||(process && process.client))? window:global;
    /**
     * 获取全局引用
     */
    public static getReference() {
        return ENV.god;
    }
}