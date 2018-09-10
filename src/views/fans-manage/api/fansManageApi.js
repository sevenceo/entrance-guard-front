import fetch from 'utils/fetch';
import {Message} from 'element-ui'
export function GetFansList(account,page) {
    let params;
    if(page){
        params = {
            page: page.page - 1,
            size: page.size,
            nickName: page.nickName,
            subscribeTimeStart: getDate(page.subscribeTimeStart),
            subscribeTimeEnd: getDate(page.subscribeTimeEnd),
            lastActionTimeStart: getDate(page.lastActionTimeStart),
            lastActionTimeEnd: getDate(page.lastActionTimeEnd),
            unsubscribeTimeStart: getDate(page.unsubscribeTimeStart),
            unsubscribeTimeEnd: getDate(page.unsubscribeTimeEnd),
            isSubscribe: page.isSubscribe,
            phoneInfo:page.phoneInfo,
            tagId:page.tagId
        }
    }
    return  fetch({
        url: '/fans-service/api/fans/'+account,
        method: 'get',
        params: params
    }).then(function (result) {
        // console.log("粉丝列表接口")
        return result
    })
}
//根据ID获取粉丝接口
export function GetFansData(account,openId) {
    return  fetch({
        url: '/fans-service/api/fans/' + account+'/'+openId+'/userinfo',
        method: 'get'
    }).then(function (result) {
        return result
    })
}

// 根据ID获取事件接口
export function GetEventPage(account,openId,page) {
    let params;
    if(page){
        params = {
            page: page.page - 1,
            size: page.size,

        }
    }
    return  fetch({
        url: '/fans-service/api/fans/' + account+'/'+openId+'/event',
        method: 'get',
        params: params
    }).then(function (result) {
        return result
    })
}

// 根据ID获取消息接口
export function GetMessagePage(account,openId,page) {
    let params;
    if(page){
        params = {
            page: page.page - 1,
            size: page.size,

        }
    }
    return  fetch({
        url: '/fans-msg-service/api/fans-msg/' + account+'/'+openId+'/message',
        method: 'get',
        params: params
    }).then(function (result) {
        return result
    })
}

// 刷新粉丝列表接口
export function GetRefreshResult(account) {
    return  fetch({
        url: '/fans-service/api/fans/' + account+'/refresh',
        method: 'get'
    }).then(function (result) {
        return result
    })
}
// 粉丝轨迹
export function GetFansOrbit(account,openId,page) {
    let params;
    if(page){
        params = {
            page: page.page - 1,
            size: page.size,

        }
    }
    return  fetch({
        url: '/fans-service/api/fans/' + account+'/'+openId+'/location',
        method: 'get',
        params: params
    }).then(function (result) {
        console.log("根据ID获取粉丝轨迹坐标")
        console.log(result)
        return result
    })
}

export function GetFansTag(account,openId) {
    return  fetch({
        url: '/wechat-userlabel/api/tag_group/' + account + '/'+ openId,
        method: 'get'
    }).then(function (result) {
        return result
    })
}

export function ExportAllFans(account,page) {
    let url = '/fans-service/api/fans/exportFans/'+account +"?nickName="+page.nickName
            +"&subscribeTimeStart="+getDate(page.subscribeTimeStart)
            +"&subscribeTimeEnd="+getDate(page.subscribeTimeEnd)
            +"&subscribeTimeStart="+getDate(page.lastActionTimeStart)
            +"&subscribeTimeEnd="+getDate(page.lastActionTimeEnd)
            +"&subscribeTimeStart="+getDate(page.unsubscribeTimeStart)
            +"&subscribeTimeEnd="+getDate(page.unsubscribeTimeEnd)
            +"&isSubscribe="+page.isSubscribe+"&phoneInfo="+page.phoneInfo;
    console.log(url);
    window.location.href = process.env.BASE_API+url;
}

function getDate(date) {
    "use strict";
    if (date) {
        if (typeof(date) == 'string') {
            date = new Date(date);
        }
        return date.toISOString(date)
    }
    return date;
}

export function GetTreeData() {
    return fetch({
        url:'/wechat-userlabel/api/tag',
        method: 'get'
    }).then(function (response) {
        return response
    })
}

export function HandTags(tags){
    return fetch({
        url:'/wechat-userlabel/api/tag_group/tag_id',
        method: 'post',
        data:tags
    }).then(function (response) {
        return response
    })
}

export function ExportEvent(account,openid){
    let url = '/fans-service/api/fans/'+account+'/'+openid+'/event/export';
    window.location.href = process.env.BASE_API+url;
}

export function filterTree(tree){
    let fileterTree = [];
    for(let index in tree){
        if(isContainHand(tree[index])){
            fileterTree.push(tree[index]);
        }
    }
    return fileterTree;
}

function isContainHand(tree){
    let flag = false;
    if(tree != null){
        if(tree.category == 'HAND'){
            flag = true;
        } else {
            if(tree.childTags != null){
                for(let index in tree.childTags){
                    if(isContainHand(tree.childTags[index])){
                        flag = true;
                        break;
                    }
                }
            }
        }
    }
    return flag;
}