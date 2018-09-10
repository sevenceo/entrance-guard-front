import fetch from 'utils/fetch'

import store from 'store'



export function CreateActivity(data) {

    return fetch({
        url: '/activity/api/we-chat-activity',
        method: 'post',
        data:data
    }).then(function (result) {
        console.log("创建活动 接口")
        console.log(result)
        return result
    })
}

export function UpdateActivity(data) {

    return fetch({
        url: '/activity/api/we-chat-activity',
        method: 'put',
        data:data
    }).then(function (result) {
        console.log("修改活动 接口")
        console.log(result)
        return result
    })
}


export function GetBaseData(account) {

    return fetch({
        url: '/activity/api/we-chat-activity/'+account+'/base',
        method: 'get',
    }).then(function (result) {
        return result
    })
}

export function GetDealerData(account,orgId) {

    return fetch({
        url: '/activity/api/we-chat-activity/'+account+'/organ?orgId='+ orgId,
        method: 'get',
    }).then(function (result) {
        console.log("获取经销商信息 接口")
        console.log(result)
        return result
    })
}
export function GetCarData(account) {

    return fetch({
        url: '/activity/api/we-chat-activity/'+account+'/series',
        method: 'get',
    }).then(function (result) {
        console.log("获取车系信息 接口")
        console.log(result)
        return result
    })
}
export function GetActivityList(account,page) {
    let params;

    if (page) {
        params = {
            page: page.page,
            size: page.size,
            activityCode: page.activityCode,
            activityName: page.activityName,
            beginDate: page.beginDate,
            endDate: page.endDate
        }
    }
    return fetch({
        url: '/activity/api/we-chat-activity/'+account+'/all',
        method: 'get',
        params: params,

    }).then(function (result) {
        console.log("获取活动列表 接口")
        console.log(result)
        return result
    })
}

export function GetActivityById(account,id) {
    return fetch({
        url: '/activity/api/we-chat-activity/'+account+'/'+ id +'/detail',
        method: 'get',

    }).then(function (result) {
        console.log("获取 ID 活动列表 接口")
        console.log(result)
        return result
    })
}
export function DeleteActivityById(account,id) {
    return fetch({
        url: '/activity/api/we-chat-activity/'+account+'/'+ id,
        method: 'delete',

    }).then(function (result) {
        console.log("根据ID删除活动  接口")
        console.log(result)
        return result
    })
}
export function GetCustomerData(page) {

    let params;

    console.log('store id')
    console.log(store.state.weChatActivityData)

    if (page) {
        params = {
            page: page.page,
            size: page.size,
            account: store.state.weChatAccount.accountInfo.account,
            activityId: page.activityId,
            activitySceneId: page.activitySceneId
        }
    }

    return fetch({
        url: '/activity/api/we-chat-activity/customer',
        method: 'get',
        params: params
    }).then(function (result) {
        console.log("获取留咨报表  接口")
        console.log(result)
        console.log(store)
        return result
    })
}
export function GetEchartsData(account,activityId,sceneId) {

    return fetch({
        url: '/activity/api/we-chat-activity/report/' + account +'/' + activityId,
        method: 'get',
        params: {
            sceneId : sceneId
        }
    }).then(function (result) {
        console.log("获取统计报表  接口")
        console.log(result)
        console.log(store)
        return result
    })
}


export function GetFieldData(account) {

    return fetch({
        url: '/activity/api/we-chat-activity/'+account+'/fields',
        method: 'get',
    }).then(function (result) {
        return result
    })
}

