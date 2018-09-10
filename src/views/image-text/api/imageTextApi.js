/**
 * Created by Micheal Xiao on 2017/8/23.
 */
import fetch from 'utils/fetch';

// 获取粉丝数据信息
export function EfansSave(param) {
    return fetch({
        url: '/report-service/api/report/articleAnalysisReport',
        method: 'post',
        dataType: "json",
        headers: {'Content-Type': 'application/json'},
        data:param
    }).then(function (result) {
        console.log("图文分析")
        console.log(result)
        return result
    })
}
export function GetNodeChildren(id) {

    return fetch({
        url: '/organization/api/organizations/tree/'+ id,
        method: 'get',
    }).then(function (response) {
        // console.log("获取子节点 接口返回数据")
        // console.log(response)
        return response
    })
}
export function GetOrgData(account) {

    return fetch({
        url: '/wechat-account/api/accounts/findorgwithaccount/' + account ,
        method: 'get',
    }).then(function (response) {
        console.log("获取组织机构  接口")
        console.log(response)
        return response
    })
}

export function GetArticleData(account, start, end) {
    let param = {
      "start" : getDate(start),
      "end" :  getDate(end)
    };
    return fetch({
        url: '/report-service/api/article/' + account ,
        method: 'get',
        params: param
    }).then(function (response) {
        return response
    })
}

export function GetArticleDetails(account,msgid,page) {
    let params;
    if(page){
        params = {
            page: page.page - 1,
            size: page.size
        }
    }
    return  fetch({
        url:'/report-service/api/article/' + account + '/' + msgid,
        method: 'get',
        params: params
    }).then(function (result) {
        return result
    })
}

export function ExportArticleDetail(account,msgid) {
    let url = '/report-service/api/article/excel/' + account + '/' + msgid;
    console.log(process.env.BASE_API + url);
    window.location.href = process.env.BASE_API + url;
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

// export function Global(id) {
//     return fetch({
//         url: '/task/api/report/global/'+id,
//         method: 'get',
//     }).then(function (result) {
//         console.log("Global报表")
//         console.log(result)
//         return result
//     })
// }
// export function Target(id) {
//     return fetch({
//         url: '/task/api/report/target/'+id,
//         method: 'get',
//     }).then(function (result) {
//         console.log("Target报表")
//         console.log(result)
//         return result
//     })
// }
