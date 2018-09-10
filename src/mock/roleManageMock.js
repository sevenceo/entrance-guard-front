/**
 * Created by Micheal Xiao on 2017/8/16.
 */

export default {
    getList: () => ([{
        id:"1",
        organizationId:"1",
        name: '系统管理员',
    },]),
    getCheckboxModules: ()=>([
        {
            "id": "dashboard",
            "name": "仪表板",
            "bewrite": "显示公众号的综合运营状态信息。",
            "actions": [
                {
                    "id": "dashboard.access",
                    "name": "查看信息"
                }
            ]
        },
        {
            "id": "activityextend",
            "name": "活动扩展菜单",
            "bewrite": "显示活动详情",
            "actions": [
                {
                    "id": "myd.access",
                    "name": "查看满意度活动"
                }
            ]
        },
        {
            "id": "systemconfig",
            "name": "系统设置",
            "bewrite": "管理和配置系统运行所需的各项参数，如信息类别，运行参数等。",
            "modules": [
                {
                    "id": "systemconfig.systemuser",
                    "name": "系统用户",
                    "bewrite": "为需要使用系统的用户，开设系统帐号、分配用户角色及使用权限。",
                    "actions": [
                        {
                            "id": "systemconfig.systemuser.access",
                            "name": "查看用户"
                        },
                        {
                            "id": "systemconfig.systemuser.create",
                            "name": "添加用户"
                        },
                        {
                            "id": "systemconfig.systemuser.modify",
                            "name": "修改用户"
                        },
                        {
                            "id": "systemconfig.systemuser.remove",
                            "name": "删除用户"
                        }
                    ]
                },
                {
                    "id": "systemconfig.userrole",
                    "name": "用户角色",
                    "bewrite": "管理系统中用户角色，并会不同的功能角色分配相应的功能权限。",
                    "actions": [
                        {
                            "id": "systemconfig.userrole.access",
                            "name": "查看角色"
                        },
                        {
                            "id": "systemconfig.userrole.create",
                            "name": "添加角色"
                        },
                        {
                            "id": "systemconfig.userrole.modify",
                            "name": "修改角色"
                        },
                        {
                            "id": "systemconfig.userrole.remove",
                            "name": "删除角色"
                        }
                    ]
                },
                {
                    "id": "systemconfig.wechataccount",
                    "name": "公众号帐号",
                    "bewrite": "用于管理系统内的微信公众号帐号信息，系统支持多个微信公众号。",
                    "actions": [
                        {
                            "id": "systemconfig.wechataccount.access",
                            "name": "查看记录"
                        },
                        {
                            "id": "systemconfig.wechataccount.create",
                            "name": "添加记录"
                        },
                        {
                            "id": "systemconfig.wechataccount.modify",
                            "name": "修改记录"
                        },
                        {
                            "id": "systemconfig.wechataccount.remove",
                            "name": "删除记录"
                        }
                    ]
                },
                {
                    "id": "systemconfig.company",
                    "name": "组织机构",
                    "bewrite": "用于管理系统内的组织机构信息。",
                    "actions": [
                        {
                            "id": "systemconfig.company.access",
                            "name": "查看记录"
                        },
                        {
                            "id": "systemconfig.company.create",
                            "name": "添加记录"
                        },
                        {
                            "id": "systemconfig.company.modify",
                            "name": "修改记录"
                        },
                        {
                            "id": "systemconfig.company.remove",
                            "name": "删除记录"
                        }
                    ]
                }
            ]
        }
    ]),
    GetRole: ()=>({
        "id": "00000000-0000-0000-0000-000000000001",
        "name": "系统管理员",
        "actionList": [
            "dashboard",
            "dashboard.access",
            "fans",
            "fans.access",
            "fans.detail",
            "message",
            "message.access",
            "message.reply",
            "autoreply",
            "autoreply.access",
            "autoreply.create",
            "autoreply.modify",
            "autoreply.remove",
            "groupsendmessage",
            "groupsendmessage.access",
            "groupsendmessage.access",
            "groupsendmessage.access",
            "recentactivities",
            "recentactivities.access",
            "recentactivities.create",
            "recentactivities.modify",
            "recentactivities.remove",
            "wechatmaterial",
            "wechatmaterial.access",
            "wechatmaterial.create",
            "wechatmaterial.modify",
            "wechatmaterial.remove",
            "wechatmenuinfo",
            "wechatmenuinfo.access",
            "wechatmenuinfo.modify",
            "wechatcard",
            "wechatcard.access",
            "wechatcard.create",
            "wechatcard.modify",
            "wechatcard.remove",
            "wechatactivity",
            "wechatactivity.access",
            "wechatactivity.create",
            "wechatactivity.modify",
            "wechatactivity.remove",
            "referrer",
            "referrer.access",
            "referrer.create",
            "referrer.modify",
            "referrer.remove",
            "presentee",
            "presentee.access",
            "presentee.create",
            "presentee.modify",
            "presentee.remove",
            "carbuyer",
            "carbuyer.access",
            "carbuyer.modify",
            "carbuyerequity",
            "carbuyerequity.access",
            "carbuyerequity.modify",
            "systemconfig",
            "systemconfig.systemuser",
            "systemconfig.systemuser.access",
            "systemconfig.systemuser.create",
            "systemconfig.systemuser.modify",
            "systemconfig.systemuser.remove",
            "systemconfig.userrole",
            "systemconfig.userrole.access",
            "systemconfig.userrole.create",
            "systemconfig.userrole.modify",
            "systemconfig.userrole.remove",
            "systemconfig.wechataccount",
            "systemconfig.wechataccount.access",
            "systemconfig.wechataccount.create",
            "systemconfig.wechataccount.modify",
            "systemconfig.wechataccount.remove",
            "systemconfig.company",
            "systemconfig.company.access",
            "systemconfig.company.create",
            "systemconfig.company.modify",
            "systemconfig.company.remove",
            "scrm",
            "scrm.scrm_fans",
            "scrm.scrm_fans.access",
            "scrm.scrm_fans.detail",
            "scrm.scrm_tag",
            "scrm.scrm_tag.access",
            "scrm.scrm_tag.create",
            "scrm.scrm_tag.modify",
            "scrm.scrm_tag.remove",
            "scrm.scrm_fansgroup",
            "scrm.scrm_fansgroup.access",
            "scrm.scrm_fansgroup.create",
            "scrm.scrm_fansgroup.modify",
            "scrm.scrm_fansgroup.remove",
            "scrm.memberunbind",
            "scrm.memberunbind.access",
            "scrm.memberunbind.create",
            "scrm.memberunbind.modify",
            "scrm.memberunbind.remove",
            "report",
            "report.activityscancode",
            "report.activityscancode.access",
            "report.dailyreport",
            "report.dailyreport.access",
            "report.weeklyreport",
            "report.weeklyreport.access"
        ],
        "description": "拥有系统全部功能权限，负责帐号的开设、基础参数的设置，以及系统的日常管理和维护。",
        "IsDefault": true
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