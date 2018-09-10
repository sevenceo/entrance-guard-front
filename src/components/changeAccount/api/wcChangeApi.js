/**
 * Created by zhaimaojin on 2017/8/16.
 */
import fetch from 'utils/fetch';
// http://10.200.8.11:8010/wechat-account/
// import axios from 'axios'

export function GetTree() {

    return fetch({
        url: '/organization/api/organizations/tree',
        method: 'get',
    }).then(function (response) {
        console.log("获取tree 接口返回数据")
        console.log(response)

        return response
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

export function GetNodeAccount(id) {

    return fetch({
        url: '/wechat-account/api/accounts/organization/' + id,
        method: 'get',
    }).then(function (response) {
        // console.log("获取组织架构下的公众号信息")
        // console.log(response)
        return response
    })
}



