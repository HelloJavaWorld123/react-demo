export const menu = [
    {key: '/app/home', title: '首页', icon: 'home', mainMenu: true},
    {key: '/app/service', title: '我的数据', icon: 'api', mainMenu: true},
    {
        key: '/app/account', title: '账户管理', icon: 'profile', mainMenu: true,
        sub: [
            {key: '/app/account/balance', title: '账户余额', icon: '',},
            {key: '/app/account/exchange', title: '交易记录', icon: '',},
            {key: '/app/account/changePayPwd', title: '支付密码', icon: '',},
        ],
    },
    {
        key: '/app/system', title: '系统管理', icon: 'setting', mainMenu: true,
        sub: [
            {key: '/app/system/news', title: '消息管理', icon: '',},
            // { key: '/app/system/operationLog', title: '操作日志', icon: '', },
            {key: '/app/system/setAccount', title: '账号设置', icon: '',},
            {key: '/app/system/changePwd', title: '密码修改', icon: '',},
            {key: '/app/system/authentication', title: '实名认证', icon: '',},
            {key: '/app/system/carListInfo', title: '车辆列表页', icon: '',},
        ],
    },
];