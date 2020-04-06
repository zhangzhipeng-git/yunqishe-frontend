// 备注：jsencrypt 服务端渲染需要在该文件中添加window和navigator
import './lib/cryptojs.min.js';
import './lib/jsencrypt.min.js';
declare class CryptoJS {
    static AES: any;
    static enc: any;
    static mode: any;
    static pad: any;
    static MD5(mes: string): string;
}

declare class JSEncrypt {
    constructor();
    encrypt(message: string): string;
    encryptLong(message: string): string;
    decrypt(cipher: string): string;
    setPublicKey(key: string): void;
    setPrivateKey(key: string): void;
}

/**
 * 前端加解密工具
 * 
 * 
 */
/**
 * 前端加密工具，经前后端联调测试
 * 
 * 备注：后台生成的二进制数据一般用base64编码成base64字符串响应给客户端
 * 其主要作用是处理特殊字符，也包含避免混淆（分不清是乱码还是加解密用的二进制数据直接编码的字符串[有特殊字符]）
 * 
 * 经测试（踩坑）:
 * 
 * 1.CryptoJS的AES加解密时，就拿加密来说，传入string类型的key和wordArray类型的key，其加密结果不一致，
 * 要想在后端解密成功，key要转成wordArray类型，这个相当于后端的getBytes。它加密的得到的密文是base64
 * 
 * 2.JSEncrypt的RSA加解密，如加密时，可以用后端传来的base64公钥直接加密，返回的也是base64密文。
 */
export default class EncryptUtil { 

    /**
     * MD5抽取摘要
     * @param str MD5抽取摘要的字符串
     */
    public static MD5(str: string): string {
        return CryptoJS.MD5(str).toString();
    }
    
    /**
     * aes加密(CBC带iv偏移，增加了解密难度)
     * @param mes 明文
     * @param key 密钥
     * @returns string base64str
     */
    public static AESEncrypt(mes: string | object, key: string): string {
        if (mes instanceof Object)
            mes = JSON.stringify(mes)
        // mes,key可以传string，也可以传wordArray
        // 为了与后端保持一致，这里要转成wordArray
        key = CryptoJS.enc.Utf8.parse(key);
        const encrypted = CryptoJS.AES.encrypt(mes, key, {
            iv: key, // 初始向量（用来做偏移加密的）与私钥相同
            mode:CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        // 变成字符串，默认utf8
        return encrypted.toString();
    }
    /**
     * AES解密
     * @param cip 密文
     * @param key 私钥
     * @returns string|object
     */
    public static AESDecrypt(cip: string, key: string): string | object {
        // cip,key可以传string，也可以传wordArray
        // 为了与后端保持一致，这里要转成wordArray
        key = CryptoJS.enc.Utf8.parse(key);
        const bytes: any = CryptoJS.AES.decrypt(cip, key, {
            iv: key, // 初始向量（用来做偏移加密的）与私钥相同
            mode:CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        // 字节变成utf8格式字符串
        let mes = bytes.toString(CryptoJS.enc.Utf8);
        const firstChar = mes.charAt(0);
        // 如果加密的是json则转成json
        if (firstChar === '{' || firstChar === '[')
        mes = JSON.parse(mes);
        return mes;
    }

    /**
     * RSA加密
     * @param mes 明文
     * @param key RSA公钥
     * @param isLong 是否采取长加密[分段加密]
     * @returns {string}
     */
    public static RSAEncrypt(mes: string|Object, key: string, isLong: boolean = false): string {
        if (mes instanceof Object) mes = JSON.stringify(mes);
        const encrypter = new JSEncrypt();
        encrypter.setPublicKey(key);
        return !isLong?encrypter.encrypt(<string>mes):(<any>encrypter).encryptLong(<string>mes);
    }

    /**
     * RSA解密
     * @param cip 密文
     * @param key RSA私钥
     * @returns {string|Object}
     */
    public static RSADecrypt(cip: string, key: string): string|Object {
        const decrypter = new JSEncrypt();
        decrypter.setPrivateKey(key);
        let mes = decrypter.decrypt(cip);
        const firstChar = mes.charAt(0);
        // 如果加密的是json则转成json
        if (firstChar === '{' || firstChar === '[')
        mes = JSON.parse(mes);
        return mes;
    }

    /**
     * 将普通字符串编码成base64字符串
     * @param str 字符串
     */
    public static str2Base64Str(str: string): string {
        const wardArray = CryptoJS.enc.Utf8.parse(str);
        return CryptoJS.enc.Base64.stringify(wardArray);
    }

    /**
     * 将base64字符串解码成普通字符串
     * @param base64Str base64字符串
     */
    public static base64Str2str(base64Str: string): string {
        const wordArray = CryptoJS.enc.Base64.parse(base64Str);
        return CryptoJS.enc.Utf8.stringify(wordArray);
    }
}
