"use strict";
exports.__esModule = true;
var Base = /** @class */ (function () {
    function Base() {
    }
    Object.defineProperty(Base.prototype, "$asyncData", {
        set: function (data) {
            if (process && process.server)
                return;
            Base.data = data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Base.prototype, "asyncData", {
        /**
         * 仅限客户端执行
         * 获取响异步应式数据数据
         */
        get: function () {
            if (process && process.server)
                return;
            setTimeout(function () {
                Base.data = null;
            });
            return Base.data;
        },
        enumerable: true,
        configurable: true
    });
    return Base;
}());
exports["default"] = Base;
