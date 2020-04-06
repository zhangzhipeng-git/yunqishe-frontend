
declare class CryptoJS {
    static AES: any;
    static enc: any;
    static mode: any;
    static pad: any;
    static MD5(mes: string): any;
}
declare class JSEncrypt {
    constructor();
    encrypt(message: string): string;
    decrypt(cipher: string): string;
    setPublicKey(key: string): void;
    setPrivateKey(key: string): void;
}