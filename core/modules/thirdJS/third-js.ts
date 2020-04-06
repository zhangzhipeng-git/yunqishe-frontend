/*
 * Project: nuxt-ssr
 * FileName: third-js.ts
 * Author: zzp-dog
 * File Created: Sunday, 29th March 2020 2:18:12 pm
 * description: 懒加载js
 * Last Modified: Sunday, 29th March 2020 4:15:29 pm
 * Modified By: zzp-dog
 * Copyright © zzp-dog, All rights reserved.
 */

interface Script {
    /** 脚本id */
    id: string;
    /** 脚本来源 */
    src: string;
    /** 脚本完整性校验，防js篡改 */
    integrity?: string;
    /** 
     * anonymous：如果使用这个值的话就会在请求中的header中的带上Origin属性，但请求不会带上cookie和其他的一些认证信息
     * use-credentials：这个就同时会在跨域请求中带上cookie和其他的一些认证信息
     */
    crossorigin?: string;
}

export default class ThirdJS {

  /**
   * 加载脚本执行完毕后回调
   * @param o 脚本
   * @param f 回调
   */
  public loadJS(o: Script[]|Script, f: any) {
    o = o instanceof Array ? o : [o];
    o.forEach((js: Script) => {
      const isExist = document.getElementById(js.id);
      if (isExist) return f();
      const script = document.createElement('script');
      script.id = js.id;
      script.src = js.src;
      script.defer = true;
      if (js.integrity) {
        script.integrity = js.integrity;
      }
      if (js.crossorigin) {
        script.crossOrigin = js.crossorigin;
      }
      script.onload = f;
      document.body.appendChild(script);
    });
  }
}
