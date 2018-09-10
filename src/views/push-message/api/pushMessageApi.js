/**
 *  基础数据
 */
import fetch from 'utils/fetch'

import store from 'store'



export function GetFansGroupList() {

    let data = {
        account: store.state.weChatAccount.accountInfo.account,
        state: "ON"
    }

    return fetch({
        url: '/wechat-userlabel/api/tag_group_config/search',
        method: 'post',
        data: data
    }).then(function (result) {
        console.log("获取粉丝组列表 接口")
        console.log(result)
        return result
    })
}

export function GetNationList() {

    return fetch({
        url: '/basicdata/api/region/findAllNation',
        method: 'get'
    }).then(function (result) {
        console.log("获取 国家 接口")
        console.log(result)
        return result
    })
}
export function GetProvinceList(id) {

    return fetch({
        url: '/basicdata/api/region/findProvinceByNationId/' + id,
        method: 'get'
    }).then(function (result) {
        console.log("获取 省份 接口")
        console.log(result)
        return result
    })
}
export function GetCityList(id) {

    return fetch({
        url: '/basicdata/api/region/findCityByProvinceId/' + id,
        method: 'get'
    }).then(function (result) {
        console.log("获取 city 接口")
        console.log(result)
        return result
    })
}
export function SendMessage(data,account) {

    return fetch({
        url: '/push-message/api/push-msg/' + account + '/createMsg',
        method: 'post',
        data:data
    }).then(function (result) {
        console.log("发送消息 接口")
        console.log(result)
        return result
    })
}

export function GetMessageHistoryList(page,account) {

    let params;
    if (page) {
        params = {
            pageNum: page.page - 1,
            pageSize: page.size,
            type:page.type
        }
    }
    return fetch({
        url: '/push-message/api/push-msg/' + account + '/getSendHistory',
        method: 'get',
        params: params
    }).then(function (result) {
        console.log("发送消息 历史 接口")
        console.log(result)
        return result
    })
}
export function GetMaterialById(account,materialType,id) {

    return fetch({
        url: '/api/materials-by-id/'+ account+ '/'+ materialType +'/' +id,
        method: 'get'
    }).then(function (result) {
        console.log("根据id 查询素材 接口")
        console.log(result)
        return result
    })
}

export function GetFansList(page) {
    let account = page.account;
    let msgSendId = page.msgSendId;
    let params;
    if(page){
        params = {
            page: page.page - 1,
            size: page.size
        }
    }
    return  fetch({
        url: '/push-message/api/push-msg/users/'+account+"/"+msgSendId,
        method: 'get',
        params: params
    }).then(function (result) {
        // console.log("粉丝列表接口")
        return result
    })
}

export function ExportAll(account,id) {
    let url = '/push-message/api/push-msg/exportUsers/'+account+'/'+id;
     window.location.href = process.env.BASE_API + url;
}
