export default class Log {
    static debug(message: string, color: COLORS = 2) {
        let c = 'orange'; // 默认蓝色
        switch (color) {
            case 0: c = 'red'; break;
            case 1: c = 'green'; break;
            case 2: c = 'black'; break;
        }

        console.log('%c ' + message, 'color:' + c + ';')

    }
} 

export enum COLORS {
    RED,
    GREEN,
    BLACK
}