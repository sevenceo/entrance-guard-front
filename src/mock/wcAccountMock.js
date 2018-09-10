/**
 * Created by Micheal Xiao on 2017/8/2.
 */
export default {
    getList: () => ({
        "msg": "执行成功!",
        "data": [
            {"id":"123123",
                "name": "test1Name",
                "account": "zhangsan1Ac1count",
                "organizationId": "1231231OrganizationId",
                "dbInstanceId": "12",
                "headImgUrl": "headimg1231321",
                "appId": "1231231appid",
                "appSecret": "secretu111Secret",
                "appToken": "123123123AppToken",
                "aesKey": "12312AesKey",
                "accessToken": "accesstok123",
                "expiresTime": "2017-08-02T09:32:21.489Z",
                "isInit": true,
                "isTokenCreating": true},
            {"id":"123123",
                "name": "test1Name",
                "account": "zhangsan1Ac1count",
                "organizationId": "1231231OrganizationId",
                "dbInstanceId": "12",
                "headImgUrl": "headimg1231321",
                "appId": "1231231appid",
                "appSecret": "secretu111Secret",
                "appToken": "123123123AppToken",
                "aesKey": "12312AesKey",
                "accessToken": "accesstok123",
                "expiresTime": "2017-08-02T09:32:21.489Z",
                "isInit": true,
                "isTokenCreating": true}
        ],
        "code": "1000",
        "timestamp": 0
    }),
    deleteAccount: ()=>({
        "msg": "删除成功!",
        "data": [],
        "code": "1000",
        "timestamp": 0
    }),
    createAccount: ()=>({
        "msg": "创建成功!",
        "data": [],
        "code": "1000",
        "timestamp": 0
    }),
    modifyAccount: ()=>({
        "msg": "修改成功!",
        "data": [],
        "code": "1000",
        "timestamp": 0
    }),
    getArticle: () => ({
        id: 120000000001,
        author: {key: 'mockPan'},
        source_name: '原创作者',
        category_item: [{key: 'global', name: '全球'}],
        comment_disabled: false,
        content: '<p>我是测试数据我是测试数据</p><p><img class="wscnph" src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943" data-wscntype="image" data-wscnh="300" data-wscnw="400" data-mce-src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>"',
        content_short: '我是测试数据',
        display_time: +new Date(),
        image_uri: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
        platforms: ['a-platform'],
        source_uri: 'https://github.com/PanJiaChen/vue-element-admin',
        status: 'published',
        tags: [],
        title: ''
    })
};