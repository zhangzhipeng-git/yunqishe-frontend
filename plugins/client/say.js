(function () {
    if (!localStorage.getItem('access')) {
        localStorage.setItem('access', new Date().getTime());
    }
    var _access = new Date(parseInt(localStorage.getItem('access')));
    var access = _access.getFullYear() + '年' + (_access.getMonth() + 1) + '月' + _access.getDate() + '日';
    var re = /x/; var i = 0;
    if (!localStorage.getItem('hit')) {
        localStorage.setItem('hit', 0);
    } else {
        i = parseInt(localStorage.getItem('hit'));
    }
    re.toString = function () {
        localStorage.setItem('hit', ++i); return '这是你自 ' + access + ' 以来第 ' + i + ' 次在本站打开控制台';
    };
    console.log(re);
})();
(function () {
    window.end = performance.now();
    if (window.end > window.start) {
        console.clear();
        console.log('%c      ', 'background: url(\'data:image/svg+xml;utf8,<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><g><text font-size="32" text-anchor="middle" x="50%" y="50%" text-transform="uppercase" fill="none" stroke="#3498db" text-shadow="0 0 1px #3498db" stroke-width="1px" stroke-dasharray="90 310">木懵の狗纸<animate attributeName="stroke-dashoffset" begin="-1.5s" dur="6s" from="0" to="-400" repeatCount="indefinite"/></text><text font-size="32" text-anchor="middle" x="50%" y="50%" text-transform="uppercase" fill="none" stroke="#f39c12" text-shadow="0 0 1px #f39c12" stroke-width="1px" stroke-dasharray="90 310">木懵の狗纸<animate attributeName="stroke-dashoffset" begin="-3s" dur="6s" from="0" to="-400" repeatCount="indefinite"/></text><text font-size="32" text-anchor="middle" x="50%" y="50%" text-transform="uppercase" fill="none" stroke="#e74c3c" text-shadow="0 0 1px #e74c3c" stroke-width="1px" stroke-dasharray="90 310">木懵の狗纸<animate attributeName="stroke-dashoffset" begin="-4.5s" dur="6s" from="0" to="-400" repeatCount="indefinite"/></text><text font-size="32" text-anchor="middle" x="50%" y="50%" text-transform="uppercase" fill="none" stroke="#9b59b6" text-shadow="0 0 1px #9b59b6" stroke-width="1px" stroke-dasharray="90 310">木懵の狗纸<animate attributeName="stroke-dashoffset" begin="-6s" dur="6s" from="0" to="-400" repeatCount="indefinite"/></text></g></svg>\') left top no-repeat; font-size: 48px;');
        console.log('%c页面加载完毕消耗了' + Math.round((window.end - window.start) * 100) / 100 + 'ms', 'background: #fff;color: #333;text-shadow: 0 0 2px #eee, 0 0 3px #eee, 0 0 3px #eee, 0 0 2px #eee, 0 0 3px #eee;');
    }
})();
window.onload = function () {
    var now = new Date().getTime();
    var page_load_time = now - performance.timing.navigationStart;
    console.log('%c      ', 'background: url(\'data:image/svg+xml;utf8,<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><g><text font-size="32" text-anchor="middle" x="50%" y="50%" text-transform="uppercase" fill="none" stroke="#3498db" text-shadow="0 0 1px #3498db" stroke-width="1px" stroke-dasharray="90 310">木懵の狗纸<animate attributeName="stroke-dashoffset" begin="-1.5s" dur="6s" from="0" to="-400" repeatCount="indefinite"/></text><text font-size="32" text-anchor="middle" x="50%" y="50%" text-transform="uppercase" fill="none" stroke="#f39c12" text-shadow="0 0 1px #f39c12" stroke-width="1px" stroke-dasharray="90 310">木懵の狗纸<animate attributeName="stroke-dashoffset" begin="-3s" dur="6s" from="0" to="-400" repeatCount="indefinite"/></text><text font-size="32" text-anchor="middle" x="50%" y="50%" text-transform="uppercase" fill="none" stroke="#e74c3c" text-shadow="0 0 1px #e74c3c" stroke-width="1px" stroke-dasharray="90 310">木懵の狗纸<animate attributeName="stroke-dashoffset" begin="-4.5s" dur="6s" from="0" to="-400" repeatCount="indefinite"/></text><text font-size="32" text-anchor="middle" x="50%" y="50%" text-transform="uppercase" fill="none" stroke="#9b59b6" text-shadow="0 0 1px #9b59b6" stroke-width="1px" stroke-dasharray="90 310">木懵の狗纸<animate attributeName="stroke-dashoffset" begin="-6s" dur="6s" from="0" to="-400" repeatCount="indefinite"/></text></g></svg>\') left top no-repeat; font-size: 48px;');
    console.log('%c页面加载完毕消耗了' + Math.round(performance.now() * 100) / 100 + 'ms', 'background: #fff;color: #333;text-shadow: 0 0 2px #eee, 0 0 3px #eee, 0 0 3px #eee, 0 0 2px #eee, 0 0 3px #eee;');
};