module.exports = {
    '/local/forum/getBlocks': {
        status: 200,
        'data|2': [
            {
                'id|+1': 1,
                name: '@ctitle(4,7)',  
                'plates|6-9': [
                    {
                        'id|+1': 1,
                        title: '@ctitle(4,10)', // c -> china
                        introduce: '@csentence',
                        amount: '@integer()',
                        concern: '@integer'
                    },
                    // {
                    //     id: 1,
                    //     title: '轻小说',
                    //     introduce: '欢迎客官们来观看(⊙o⊙)？',
                    //     amount: 5,
                    //     concern: 7
                    // },
                    // {
                    //     id: 1,
                    //     title: '轻小说',
                    //     introduce: '欢迎客官们来观看(⊙o⊙)？',
                    //     amount: 5,
                    //     concern: 7
                    // },
                    // {
                    //     id: 1,
                    //     title: '轻小说',
                    //     introduce: '欢迎客官们来观看(⊙o⊙)？',
                    //     amount: 5,
                    //     concern: 7
                    // },
                    // {
                    //     id: 1,
                    //     title: '轻小说',
                    //     introduce: '欢迎客官们来观看(⊙o⊙)？',
                    //     amount: 5,
                    //     concern: 7
                    // },
                    // {
                    //     id: 1,
                    //     title: '轻小说',
                    //     introduce: '欢迎客官们来观看(⊙o⊙)？',
                    //     amount: 5,
                    //     concern: 7
                    // },
                    // {
                    //     id: 1,
                    //     title: '轻小说',
                    //     introduce: '欢迎客官们来观看(⊙o⊙)？',
                    //     amount: 5,
                    //     concern: 7
                    // }
                ]
            },
            // {
            //     id: 2,
            //     name: '原创相关',
            //     plates: [
            //         {
            //             id: 1,
            //             title: '轻小说',
            //             introduce: '欢迎客官们来观看(⊙o⊙)？',
            //             amount: 5,
            //             concern: 7
            //         },
            //         {
            //             id: 2,
            //             title: '轻小说',
            //             introduce: '欢迎客官们来观看(⊙o⊙)？',
            //             amount: 5,
            //             concern: 7
            //         },
            //         {
            //             id: 3,
            //             title: '轻小说',
            //             introduce: '欢迎客官们来观看(⊙o⊙)？',
            //             amount: 5,
            //             concern: 7
            //         },
            //         {
            //             id: 4,
            //             title: '轻小说',
            //             introduce: '欢迎客官们来观看(⊙o⊙)？',
            //             amount: 5,
            //             concern: 7
            //         }
            //     ]
            // }
        ]
    },
    // 请求帖子
    '/local/forum/getInvitation': {
        status: 200,
        data: {
            id: 1, // 帖子id
            pid: -1, // 帖子父id 
            bid: 2,  // 所属板块id
            author: { // 作者信息
                id: 22,
                avator: '@image(40x50)',
                neck: '@cname()',
                "vip|1": ['超级会员', '普通会员', ''],
                "identity|1": ['超级版主', '版主'],
                "designation|1": ['王者', '大师', '钻石', '珀金', '黄金', 
            "白银", "青铜", "黑铁"],
            "level|1": [0,1,2,3,4,5,6,7,8,9,10]
            },
            title: "测试帖子", // 帖子标题
            // abstract: "@csentence()" , // 摘要
            content: "@csentence(10,20)", // 帖子内容
            address: "@cname()", // 发帖地址
            "device|1": ["移动端","电脑端"], // 发帖设备
            "time": "@datetime()", // 发帖时间
            "collectcount": 22, // 收藏数量
            viewcount: 33, // 浏览次数
            thumbupcount: 44, // 点赞次数
            replylevel: 0, // 回复层级
            "reply|1-1": [ // 回复
                {
                    id: 22,
                    pid: 1,
                    to: 33, // 对谁回复 ，用户id ，这是第一层回复，因此非必须
                    author: { // 作者信息
                        id: 24,
                        avator: '@image()',
                        neck: '@cname()',
                        "level|1": [0,1,2,3,4,5,6,7,8,9,10],
                    },
                    content: "@csentence(10,20)", // 回复内容
                    "device|1": ["移动端","电脑端"], // 回复设备
                    "time": "@datetime()", // 回复时间
                    thumbupcount: 44, // 点赞次数
                    thumbdowncount: 33, // 踩数量
                    replycount:11, // 第一层回复数量
                    replylevel: 1, // 回复层级
                    // 大于第2层的回复全部展开到第二层回复，帖子是第0层！！！
                    "reply|3-3": [ // > 3 条另外再请求
                        {
                            id: 23,
                            pid: 22,
                            "to|+1": 24, // 对谁回复 ，用户id ，这是第2层回复，必须
                            author: { // 作者信息
                                avator: '@image()',
                                neck: '@cname()',
                                "level|1": [0,1,2,3,4,5,6,7,8,9,10],
                            },
                            content: "@csentence(10,20)", // 回复内容
                            "device|1": ["移动端","电脑端"], // 回复设备
                            "time": "@datetime()", // 回复时间
                            thumbup: 44, // 点赞次数
                            thumbdown: 33, // 踩数量
                            replylevel: 2, // 回复层级

                        }
                    ]
                }
            ]

        }
    }
}