/**
 * Created by Micheal Xiao on 2017/9/7.
 */
import fetch from 'utils/fetch';

export function GetTree() {
    return fetch({
        url: '/organization/api/organizations/tree',
        method: 'get',
    }).then(function (response) {
        // console.log("获取tree 接口返回数据")
        // console.log(response)
        return response
    })
}

export function GetNodeChildren(id, enable) {
    return fetch({
        url: '/organization/api/organizations/tree/'+ id + (enable ? "/enabled" : ""),
        method: 'get',
    }).then(function (response) {
        // console.log("获取子节点 接口返回数据")
        // console.log(response)
        return response.data
    })
}