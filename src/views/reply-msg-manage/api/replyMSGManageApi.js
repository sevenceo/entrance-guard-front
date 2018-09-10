import fetch from 'utils/fetch';
import {Message} from 'element-ui';
export function GetReplyMSGList(account,page) {
    let params;
    if(page){
        params = {
            page: page.page - 1,
            size: page.size
        }
    }
    return  fetch({
        url: '/auto-reply-service/api/auto-reply/'+account,
        method: 'get',
        params: params
    }).then(function (result) {
        console.log("自动回复列表接口")
        console.log(result)
        return result
    })
}
export function EditorReply(account,data) {
    return fetch({
        url: '/auto-reply-service/api/auto-reply/'+account,
        method: 'put',
        data: data
    }).then(function (result) {
        console.log("编辑自动回复接口")
        console.log(result)
        Message({
            message: '编辑回复成功',
            type: 'success',
            customClass:'msg-success',
            iconClass:'ic'
        })
        return result
    })
}

export function DeleteReply(account,id) {
    return fetch({
        url: '/auto-reply-service/api/auto-reply/'+account+'/'+id,
        method: 'delete',
    }).then(function (result) {
        console.log("删除自动回复接口")
        console.log(result)
        Message({
            message: '删除回复成功',
            type: 'success',
            customClass:'msg-success',
            iconClass:'ic'
        })
        return result
    })
}
export function CreateReplyData(account,data) {
    let postData = $.extend({},data)
    return fetch({
        url: '/auto-reply-service/api/auto-reply/'+account,
        method: 'post',
        data: postData
    }).then(function (result) {
        console.log("创建自动回复接口")
        console.log(result)
        Message({
            message: '创建自动回复成功',
            type: 'success',
            customClass:'msg-success',
            iconClass:'ic'
        })
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

// 获取粉丝组信息
export function GetFansGroupList(account){
    let data = {"account":account};
    return fetch({
        url:  '/wechat-userlabel/api/tag_group_config/search',
        method: 'post',
        data: data,
    }).then(function (result) {
        console.log("获取粉丝组信息")
        console.log(result)
        return result
    })
}