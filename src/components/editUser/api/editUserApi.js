/**
 * Created by zyk on 2017/9/13.
 */

import fetch from 'utils/fetch';
import {Message} from 'element-ui'

export function EditorUser(data) {
    return fetch({
        url: '/api/auth/sys-user/updateSeleveUserInfo',
        method: 'post',
        data: data
    }).then(function (result) {
        return result.data;
    });/*.then(function (result) {
        /!*Message({
            message: '编辑用户成功',
            type: 'success',
            customClass:'msg-success',
            iconClass:'ic'
        })*!/
        return result
    })*/
}

// 获取角色列表
export function GetUsers(){
    return fetch({
        url: '/uaa/api/users/current',
        method: 'get'
    }).then(function (result) {
        return result;
    })
}


export function getCurrentInfo(token) {
    return fetch({
        url: process.env.BASE_API +'/api/auth/users/current',
        method: 'get',
        headers: {
            "Authorization": token
        }
    });
}