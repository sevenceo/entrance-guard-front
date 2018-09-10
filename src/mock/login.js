import {onlyParam2Obj} from 'utils';

const userMap = {
    admin: {
        role: ['admin'],
        token: 'admin',
        introduction: '我是超级管理员',
        avatar: 'https://wdl.wallstreetcn.com/48a3e1e0-ea2c-4a4e-9928-247645e3428b',
        name: '超级管理员小潘',
        uid: '001'
    },
    editor: {
        role: ['editor'],
        token: 'editor',
        introduction: '我是编辑',
        avatar: 'https://wdl.wallstreetcn.com/48a3e1e0-ea2c-4a4e-9928-247645e3428b',
        name: '普通编辑小张',
        uid: '002'

    },
    developer: {
        role: ['develop'],
        token: 'develop',
        introduction: '我是开发',
        avatar: 'https://wdl.wallstreetcn.com/48a3e1e0-ea2c-4a4e-9928-247645e3428b',
        name: '工程师小王',
        uid: '003'
    }
}

const adminInfo = {
    "id" : "1",
    "userName" : "admin",
    "realName" : "平台管理员",
    "organization" : null,
    "roleList" : [ "MANAGE", "ADMIN" ],
    "actionList" : null,
    "accessToken" : null,
    "refreshToken" : null,
    "expiresSeconds" : 0,
    "email" : "admin@111.com",
    "phone" : "18099077012",
    "service" : [ "Fans", "Fans.Detial", "Fans.Reply", "Server", "Server.Reply", "PushMessage", "PushMessage.many", "PushMessage.one", "Material", "Material.Mine", "Material.Mine.Create", "Material.Mine.Modify", "Material.Mine.Remove", "Material.Mine.Share", "Material.Share", "Material.Share.download", "Label", "UserLabel", "UserLabel.Maintenance", "UserLabel.Count", "FansGroup", "FansGroup.Manufacturer.Maintenance", "FansGroup.Agency.Maintenance", "FansGroup.Count", "FansGroup.export", "Analysis", "Analysis.Increase", "Analysis.Distributed", "Analysis.Article", "Activity", "Card", "Card.Create", "Card.Modify", "Card.Remove", "Card.sync", "SystemConfig.DataCenter", "SystemConfig.DataCenter.Create", "SystemConfig.DataCenter.Modify", "SystemConfig.DataCenter.Remove", "SystemConfig.Account", "SystemConfig.Account.Create", "SystemConfig.Account.Modify", "SystemConfig.Account.Remove", "WeChatMenuInfo", "WeChatMenuInfo.Modify", "AutoReply", "AutoReply.Create", "AutoReply.Modify", "AutoReply.Remove", "SystemConfig", "SystemConfig.Company", "SystemConfig.Company.Create", "SystemConfig.Company.Modify", "SystemConfig.Company.Remove", "SystemConfig.SystemUser", "SystemConfig.SystemUser.Create", "SystemConfig.SystemUser.Modify", "SystemConfig.SystemUser.Remove", "SystemConfig.UserRole", "SystemConfig.UserRole.Create", "SystemConfig.UserRole.Modify", "SystemConfig.UserRole.Remove", "CarSeriesMaintenance", "CarSeriesMaintenance.Create", "CarSeriesMaintenance.Modify", "CarSeriesMaintenance.Remove", "BrandMaintenance", "BrandMaintenance.Create", "BrandMaintenance.Modify", "BrandMaintenance.Remove","SystemConfig.ModuleManage" ],
    "organizationid" : "00000000-0000-0000-0000-000000000001",
    "userLevel" : 1,
    "roles" : [ {
        "id" : "3",
        "name" : "MANAGE",
        "organizationId" : null,
        "service" : "[]",
        "status" : "DELETE",
        "description" : "MANAGE comment",
        "isDefault" : false,
        "permitLevel" : 4
    }, {
        "id" : "1",
        "name" : "ADMIN",
        "organizationId" : "00000000-0000-0000-0000-000000000001",
        "service" : "[\"Fans\",\"Fans.Detial\",\"Fans.Reply\",\"Server\",\"Server.Reply\",\"PushMessage\",\"PushMessage.many\",\"PushMessage.one\",\"Material\",\"Material.Mine\",\"Material.Mine.Create\",\"Material.Mine.Modify\",\"Material.Mine.Remove\",\"Material.Mine.Share\",\"Material.Share\",\"Material.Share.download\",\"Label\",\"UserLabel\",\"UserLabel.Maintenance\",\"UserLabel.Count\",\"FansGroup\",\"FansGroup.Manufacturer.Maintenance\",\"FansGroup.Agency.Maintenance\",\"FansGroup.Count\",\"FansGroup.export\",\"Analysis\",\"Analysis.Increase\",\"Analysis.Distributed\",\"Analysis.Article\",\"Activity\",\"Card\",\"Card.Create\",\"Card.Modify\",\"Card.Remove\",\"Card.sync\",\"SystemConfig.DataCenter\",\"SystemConfig.DataCenter.Create\",\"SystemConfig.DataCenter.Modify\",\"SystemConfig.DataCenter.Remove\",\"SystemConfig.Account\",\"SystemConfig.Account.Create\",\"SystemConfig.Account.Modify\",\"SystemConfig.Account.Remove\",\"WeChatMenuInfo\",\"WeChatMenuInfo.Modify\",\"AutoReply\",\"AutoReply.Create\",\"AutoReply.Modify\",\"AutoReply.Remove\",\"SystemConfig\",\"SystemConfig.Company\",\"SystemConfig.Company.Create\",\"SystemConfig.Company.Modify\",\"SystemConfig.Company.Remove\",\"SystemConfig.SystemUser\",\"SystemConfig.SystemUser.Create\",\"SystemConfig.SystemUser.Modify\",\"SystemConfig.SystemUser.Remove\",\"SystemConfig.UserRole\",\"SystemConfig.UserRole.Create\",\"SystemConfig.UserRole.Modify\",\"SystemConfig.UserRole.Remove\",\"CarSeriesMaintenance\",\"CarSeriesMaintenance.Create\",\"CarSeriesMaintenance.Modify\",\"CarSeriesMaintenance.Remove\",\"BrandMaintenance\",\"BrandMaintenance.Create\",\"BrandMaintenance.Modify\",\"BrandMaintenance.Remove\",\"SystemConfig.ModuleManage\"]",
        "status" : "NORMAL",
        "description" : "ADMIN comment",
        "isDefault" : false,
        "permitLevel" : 1
    } ],
    "organizationName" : "上汽集团",
    "bewrite" : "string"
}

export default {
    loginByEmail: config => {
        // const login = onlyParam2Obj(config.body)
        // return userMap[login.username];
        // const {email} = JSON.parse(config.body);
        // return userMap[email.split('@')[0]];
        return {
            // "access_token" : "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTE4OTM1NjQsInVzZXJfbmFtZSI6ImFkbWluIiwiYXV0aG9yaXRpZXMiOlsiMSIsIjMiXSwianRpIjoiOWVmNWQ3MjUtNzMwMC00MzVkLTk0NjAtYzM1ZTNiNGU0ZTk0IiwiY2xpZW50X2lkIjoid2ViX2FwcCIsInNjb3BlIjpbIm9wZW5pZCJdfQ.QoeYrNk_DXpgqnFBO62mCOkyBuwSO9vFbzptaJYjCD9V_gDKcfLLd0R6s76XgJeJcX1IupQYB6_H23uigpxL2tSBOyNt9etx5H7_Ws3UQynHmLjdT8WgKULtKG6Lp0i0X1Njy61w1kM_huEFCzBsu2KB38PMSss9PmhEbiKM5IDkanNxXRuXcTiStgbp24tAKeotilAWLondEvqOfNvmD_0yrGFGRm7zvqMnWXcozMQ6fYjtCTV1Yc9nyC9ab1-_72hwjX-juKTmJ4vT-C_rbHogcFsmm5_Joq1jRNsXmXKV94LGXerVdEUdP4yW2Q-iSvQrQPxaEXOoavTioec21Q",
            // "token_type" : "bearer",
            // "refresh_token" : "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbIm9wZW5pZCJdLCJhdGkiOiI5ZWY1ZDcyNS03MzAwLTQzNWQtOTQ2MC1jMzVlM2I0ZTRlOTQiLCJleHAiOjE1MTQ0NDIzNjQsImF1dGhvcml0aWVzIjpbIjEiLCIzIl0sImp0aSI6IjJiZmQ1Mzk3LTYxZTAtNDg4Zi05MDc1LTIzMDM0OWQ2YmQyNiIsImNsaWVudF9pZCI6IndlYl9hcHAifQ.YFLnG0L8PV8Iu1wAE88DVkZVsjSIMrnAtt8yYHB11vZjW7UUb-M9UrAzuBqlAqrGwhWGCNxBUUjmeaqW5ZTuFgizJFhFluH_yHwnPfaSbiqcg6Jzw0XwExcp3-gYTDFlVplMayCMIl1QzwCWIzVj7kDTYdzXQH1gvgpOHfhG8B5dWoFfKItCDCZB_10IuTFLrz-CjIXveSWPy7zW71SNJZLRCNGYIz9V8cn7IXcZk5kCTBup3DH7gDSXdW_Fk2smvBWXgCBADw02Citm91U8skEanteuVDYCh8s2Ft6kmEc1jY3QhMf6rgyQAmx4Ms9U87G1DsBIX2qc0d38slnqAw",
            // "expires_in" : 43199,
            // "scope" : "openid",
            // "jti" : "9ef5d725-7300-435d-9460-c35e3b4e4e94"
        }
    },
    getAccountInfo: config => {
        return "gh_a28c42da26be"
    },
    getInfo: config => {
        return adminInfo
        // const {token} = param2Obj(config.url);
        // if (userMap[token]) {
        //     return userMap[token];
        // } else {
        //     return Promise.reject('a');
        // }
    },
    logout: () => 'success'
};
