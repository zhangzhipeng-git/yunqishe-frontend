let promise = null;

try {
    promise = new Promise(res => {
        setTimeout(() => {
            res();
            throw new Error('timeout');
        }, 3000)
    })
} catch (e) { // catch永远不会被执行，因为上面的try代码是异步的，不会即刻抛出异常
    console.log('do.....');
    console.log(e)
}
console.log(promise);