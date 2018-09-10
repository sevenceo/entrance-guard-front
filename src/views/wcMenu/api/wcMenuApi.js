/**
 * Created by Micheal Xiao on 2017/8/3.
 */
import fetch from 'utils/fetch';

export function GetMenuData() {

    return fetch({
        url: '/wechat-menu-service/api/menus/' + localStorage.aid,
        method: 'get'
    }).then(function (response) {
        console.log("获取微信菜单接口")
        console.log(response)
        // console.log(response.headers)
        // console.log(response.headers('X-Total-Count'))
        return response
    })
}

export function SaveMenuData(data) {
    for(let n in data){
        data[n].forEach(function (v) {
            if(v.index){delete v.index}
            if(v.group){delete v.group}
        })
    }

    return fetch({
        url: '/wechat-menu-service/api/menus',
        method: 'put',
        data:{
            "account": localStorage.aid,
            "weChatMenuButtonGroup":data
        }
    }).then(function (result) {
        console.log("保存微信菜单接口")
        console.log(result)
        return result
    })
}

export function TestError() {
    return fetch({
        url: '/wechat-menu-service/api/menus/error/1',
        method: 'get',
    }).then(function (result) {
        console.log("调试错误信息接口")
        console.log(result)
        return result
    })
}



