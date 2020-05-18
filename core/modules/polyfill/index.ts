export default class Polyfill {
    
    public static init() {
        this.addStringPolyfill();
    }

    /**
     * 给String类添加一些polyfill
     */
    private static addStringPolyfill() {
        if (!String.prototype.repeat) {
            // @ts-ignore
            String.prototype.repeat = function(len) {
                let _this = this;
                for (let i = 0; i < len-1; i++) {
                    // @ts-ignore
                    _this += this;
                }
                return _this;
            }
        };
    }
}