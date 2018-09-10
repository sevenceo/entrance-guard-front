/**
 * Created by Micheal Xiao on 2017/8/23.
 */
import fetch from 'utils/fetch';
import {Message} from 'element-ui'

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
        url: '/api/auth/saas-corporation/searchList',
        method: 'POST',
        data: page
    }).then(function (response) {
        return response.data
    })

    // return fetch({
    //     url: '/uaa/api/users',
    //     method: 'get',
    //     params: params
    // }).then(function (result) {
    //     console.log("用户列表接口")
    //     console.log(result)
    //     return result
    // })
}

export function Create(data) {
    return fetch({
        url: '/api/auth/saas-corporation',
        method: 'POST',
        data: data
    }).then(function (result) {
        if (result) {
            Message({
                message: '创建企业成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            })
            return result.data
        }
    })
}

export function Editor(data) {
    // let putData = $.extend({}, data, {
    //     password: encodeURIComponent(data.password)
    // })
    return fetch({
        url: '/api/auth/saas-corporation/' + data.id,
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
        url: '/api/auth/saas-corporation/' + id,
        method: 'DELETE',
    }).then(function (result) {
        console.log("删除企业接口")
        console.log(result)
        Message({
            message: '删除企业成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}