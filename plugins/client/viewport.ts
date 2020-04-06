/** 兼容 web界面根据移动端屏幕宽度自动缩放 */
// @ts-nocheck
(function () {
    var phoneWidth = parseInt(window.screen.width);
    var phoneScale = phoneWidth/960;//除以的值按pc端最小宽度
    var ua = navigator.userAgent;
    var head = document.head;
    var title = head.getElementsByTagName('TITLE')[0];
    var meta = document.createElement('meta');
    var content = 'width=device-width, initial-scale=1';
    meta.name = 'viewport';
    if (/Android (\d+\.\d+)/.test(ua)) {
        var version = parseFloat(RegExp.$1);
        // andriod 2.3
        if (version > 2.3) {
            content='width=device-width,initial-scale=' + phoneScale + ',minimum-scale=' + phoneScale + ',maximum-scale=' + phoneScale + ',user-scalable=no';
        }
    } else {
        content='width=device-width, initial-scale=' + phoneScale + ',minimum-scale=' + phoneScale + ',maximum-scale =' + phoneScale + ',user-scalable=no';
    }
    meta.content = content;
    head.insertBefore(meta, title);
})();;