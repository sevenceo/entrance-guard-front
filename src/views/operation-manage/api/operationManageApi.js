/**
 * Created by Micheal Xiao on 2017/8/23.
 */
import fetch from 'utils/fetch';
import {Message} from 'element-ui'

export function SearchByUserId() {
    return fetch({
        url: '/api/auth/system/searchByUserId',
        method: 'GET',
    }).then(function (response) {

        return response.data
    })
}

export function GetList(page) {
    let params;
    if (page) {
        params = $.extend({
            //分页信息
            page: page.page,
            pageNum: page.page,
            pageSize: page.size,
        }, page);
    }

    return fetch({
        url: '/api/auth/operator/searchList',
        method: 'POST',
        data: page
    }).then(function (response) {
        return response.data
    })
}

export function GetModule(data) {
    return fetch({
        url:'/api/auth/auth/module/getBySystemCodes/searchData',
        method: 'POST',
        data: data
    }).then(function (response) {
        return response.data
    })
}

export function Create(data) {
    return fetch({
        url: '/api/auth/operator',
        method: 'POST',
        data: data
    }).then(function (result) {
        if (result) {
            Message({
                message: '创建操作成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            })
            return result.data
        }
    })
}

export function Editor(data) {
    return fetch({
        url: '/api/auth/operator/' + data.id,
        method: 'PATCH',
        data: data
    }).then(function (result) {
        if (result) {
            Message({
                message: '编辑成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            })
            return result.data
        }
    })
}

export function Delete(id) {
    return fetch({
        url: '/api/auth/operator/' + id,
        method: 'DELETE',
    }).then(function (result) {
        Message({
            message: '删除操作成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}

export function GetCode(id) {
    return fetch({
        url: '/api/auth/operator/getcode',
        method: 'POST',
    }).then(function (result) {
        return result.data
    })
}

