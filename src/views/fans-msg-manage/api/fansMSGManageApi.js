import fetch from 'utils/fetch';
import {Message} from 'element-ui'
export function GetFansMSGList(account, page) {
    let params;
    if (page) {
        params = {
            page: page.page - 1,
            size: page.size,
            nickName: page.nickName,
            startTime: page.startTime,
            endTime: page.endTime,
            isReply:page.isReply
        }
    }
    return fetch({
        url: '/fans-msg-service/api/fans-msg/' + account,
        method: 'get',
        params: params
    }).then(function (result) {
        // console.log("粉丝消息列表接口")
        // console.log(result)
        return result
    })
}
export function GetMSGDetailList(account, openId, page) {
    let params;
    if (page) {
        params = {
            page: page.page - 1,
            size: page.size,
            content: page.keyWord
        }
    }
    return fetch({
        url: '/fans-msg-service/api/fans-msg/' + account + '/' + openId + '/message',
        method: 'get',
        params: params,
    }).then(function (result) {
        // console.log("粉丝消息详情列表接口")
        // console.log(result)
        return result
    })
}
export function SaveMSG(account, data) {
    console.log(data)
    let postData = $.extend({}, data)
    return fetch({
        url: '/fans-msg-service/api/fans-msg/' + account + '/saveMsg',
        method: 'post',
        data: postData
    }).then(function (result) {
        console.log("回复消息接口")
        console.log(result)
        Message({
            message: '回复消息成功',
            type: 'success',
            customClass:'msg-success',
            iconClass:'ic'

        })
        return result
    })
}

export function GetMsgState(account) {
    return fetch({
        url: '/fans-msg-service/api/fans-msg/' + account + '/msgState',
        method: 'get'
    }).then(function (result) {
        // console.log("获取公众号状态接口")
        //console.log(result)
        return result
    })
}
export function GetUserMsgState(account,openId) {
    return fetch({
        url: '/fans-msg-service/api/fans-msg/' + account +'/'+openId+ '/userMsgState',
        method: 'get'
    }).then(function (result) {
        // console.log("获取消息状态接口")
        //console.log(result)
        return result
    })
}


export function GetFansData(account,openId) {
    return  fetch({
        url: '/fans-service/api/fans/' + account+'/'+openId+'/userinfo',
        method: 'get'
    }).then(function (result) {
        console.log("根据ID获取粉丝接口")
        console.log(result)
        return result
    })
}

// 获取粉丝标签信息
export function GetFansLabelList(account,openId){
    let data = {"account":account};
    return fetch({
        url:  '/wechat-userlabel/api/tag_group/' + account+'/'+openId,
        method: 'get',
        data: data,
    }).then(function (result) {
        console.log("获取粉丝标签信息")
        console.log(result)
        return result
    })
}

// 获取素材列表
export function GetReplyData(account,pushType){
    return fetch({
        url:  '/material/api/we-chat-materials?account='+account+'&materialType='+pushType.toUpperCase(),
        method: 'get',
    }).then(function (result) {
        console.log("获取素材列表")
        console.log(result)
        // Message({
        //     message: '',
        //     type: 'success'
        // })
        return result
    })
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