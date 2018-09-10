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
        url: '/api/auth/dictionary/searchList',
        method: 'POST',
        data: page
    }).then(function (response) {
        return response.data
    })
}

export function GetParentList() {
    return fetch({
        url:'/api/auth/dictionary/parents',
        method: 'GET'
    }).then(function (response) {
        return response.data
    })
}

export function Create(data) {
    return fetch({
        url: '/api/auth/dictionary',
        method: 'POST',
        data: data
    }).then(function (result) {
        if (result) {
            Message({
                message: '创建数据字典项成功',
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
        url: '/api/auth/dictionary/' + data.id,
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

// export function Delete(id) {
//     return fetch({
//         url: '/api/auth/saas-corporation/' + id,
//         method: 'DELETE',
//     }).then(function (result) {
//         console.log("删除企业接口")
//         console.log(result)
//         Message({
//             message: '删除企业成功',
//             type: 'success',
//             customClass: 'msg-success',
//             iconClass: 'ic'
//         })
//         return result
//     })
// }

export function Delete(id) {
    return fetch({
        url: '/api/auth/dictionary/' + id,
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