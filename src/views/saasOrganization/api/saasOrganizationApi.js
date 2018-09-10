import fetch from  'utils/fetch';
import {Message} from 'element-ui';
/**
 * 查询 组织模块树  数据
 * @param data
 * @constructor
 */
export function SearchTree(data) {
    return fetch({
        url: '/api/auth/saas-organization/searchTree/getByParam?d='+new Date(),
        method: 'POST',
        // params: params,
        data:data
    }).then(function (result) {
        return result.data;
    })
}
/**
 * 查询组织列表
 * @param data
 */
export function Page(page) {
    let params;
    if (page) {
        params = {
            //分页信息
            page: page.page,
            pageNum: page.page,
            pageSize: page.size,
        }
    }

    return fetch({
        url: '/api/auth/saas-organization/searchList',
        method: 'post',
        data:page
    }).then(function (result) {
        return result.data;
    })
}
/**
 * 查询所有微服务
 * @param data
 */
export function SearchByUserId() {
    return fetch({
        url: '/api/auth/system/searchByUserId?d='+new Date(),
        method: 'get',
        // params: params,
        // data:data
    }).then(function (result) {
        return result.data;
    })
}
/**
 * 获取编码
 * @param data
 */
export function Getcode() {
    return fetch({
        url: '/api/auth/saas-organization/getcode?d='+new Date(),
        method: 'post',
        // params: params,
        data:{}
    }).then(function (result) {
        return result.data;
    })
}
/**
 * 新增
 * @param data
 */
export function Create(data) {
    return fetch({
        url: '/api/auth/saas-organization',
        method: 'POST',
        data: data
    }).then(function (result) {
        Message({
            message: '创建成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result;
    })
}

export function Editor(data) {
    return fetch({
        url: '/api/auth/saas-organization/'+data.id,
        method: 'PATCH',
        data: data
    }).then(function (result) {
        Message({
            message: '编辑成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result;
    })
}

export function Delete(id) {
    return fetch({
        url: '/api/auth/saas-organization/' + id,
        method: 'DELETE',
    }).then(function (result) {
        Message({
            message: '删除成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result;
    })
}

export function GetParentName(id) {
    return fetch({
        url: '/api/auth/auth/module/' + id,
        method: 'GET',
    }).then(function (result) {
        return result.data;
    })
}

export function GetAllModule(data) {
    return fetch({
        url: '/api/auth/auth/module/searchData',
        method: 'POST',
        data: data
    }).then(function (result) {
        return result.data;
    })
}