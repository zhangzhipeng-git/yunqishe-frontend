/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\core\init.ts
 * Created Date: Sunday, July 19th 2020, 12:21:09 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 初始化数据仓库
 * Last Modified: Saturday July 25th 2020 8:34:56 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

import { http, db } from './context/app-context';

export default async function init() {
    await http.get("/level/f/select/list").then((data: any) => {
        db.set("userLevels", data.data.levels);
    });
}