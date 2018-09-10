/**
 * Created by Micheal Xiao on 2017/8/23.
 */
import fetch from 'utils/fetch';
import {Message} from 'element-ui'

// 获取粉丝数据信息
export function EfansSave(param) {
    return fetch({
        url: '/report-service/api/report/fansDistributedReport',
        method: 'post',
        dataType: "json",
        headers: {'Content-Type': 'application/json'},
        data:param
    }).then(function (result) {
        console.log("粉丝分布信息")
        console.log(result)
        return result
    })
}

// 获取粉丝数据信息
export function FansGeo(id) {
    return fetch({
        url: '/report-service/api/report/dashboard/'+id,
        method: 'get',
    }).then(function (result) {
        console.log("粉丝数据信息")
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
// export function Global(id) {
//     return fetch({
//         url: '/report-service/api/report/global/'+id,
//         method: 'get',
//     }).then(function (result) {
//         console.log("Global报表")
//         console.log(result)
//         return result
//     })
// }
// export function Target(id) {
//     return fetch({
//         url: '/report-service/api/report/target/'+id,
//         method: 'get',
//     }).then(function (result) {
//         console.log("Target报表")
//         console.log(result)
//         return result
//     })
// }
