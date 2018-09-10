import fetch from  'utils/fetch';
import {Message} from 'element-ui';

/**
 * 角色分页查询
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

            //查询条件
            corpCode: page.corpCode,
            corpName: page.corpName
        }
    }

    return fetch({
        url: '/api/auth/auth/role/page?d=' + new Date(),
        method: 'post',
        // params: params,
        data: page
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
        url: '/api/auth/auth/role/add?d=' + new Date(),
        method: 'POST',
        data: data
    }).then(function (result) {
        if (result) {
            Message({
                message: '创建角色成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            })
        }
        return result;
    })
}

export function Editor(data) {
    return fetch({
        url: '/api/auth/auth/role/edit?d=' + new Date(),
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
        url: '/api/auth/auth/role/' + id,
        method: 'DELETE',
    }).then(function (result) {

        return result;
    })
}
/**
 * 查询所有系统
 * @param data
 */
export function GetAllSystem() {
    return fetch({
        url: '/api/auth/system/searchAll?d=' + new Date(),
        method: 'POST',
        // params: params,
        data: {enabledFlag: 1}
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
        url: '/api/auth/auth/role/getcode?d=' + new Date(),
        method: 'post',
        // params: params,
        data: {}
    }).then(function (result) {
        return result.data;
    })
}
/**
 * 获取上级角色
 * @param data
 */
export function GetParentRole(data) {
    return fetch({
        url: '/api/auth/auth/belong/role?d=' + new Date(),
        method: 'post',
        data: data
    }).then(function (result) {
        return result.data;
    })
}

/**
 * 获取所有权限
 * @param data
 * @constructor
 */
export function GetAllAuth(data) {
    return fetch({
        url: '/api/auth/permit/listView/getAll/null?d=' + new Date(),
        method: 'GET',
    }).then(function (result) {
        return result.data;
    })
}


/**
 * 获取角色权限
 * @param data
 * @constructor
 */
export function GetRoleAllAuth(id) {
    return fetch({
        url: '/api/auth/permit/ids/role/' + id,
        method: 'GET',
    }).then(function (result) {
        return result.data;
    })
}

/**
 * 分配权限
 * @constructor
 */
export function UpdateAuth(id, data) {
    return fetch({
        url: '/api/auth/permit/role/update/' + id,
        method: 'PUT',
        data: data
    }).then(function (result) {
        Message({
            message: '分配成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result.data;
    })
}
/**
 * 查询企业
 * @constructor
 */
export function GetCorporationAll() {
    return fetch({
        url: '/api/auth/saas-corporation/searchAll?d=' + new Date(),
        method: 'post',
        data: {enabledFlag: 1}
    }).then(function (result) {
        return result.data;
    })
}

export function GetAllRoles() {
    return fetch({
        url: '/api/auth/auth/role/getAll?d=' + new Date(),
        method: 'GET'
    }).then(function (result) {
        return result.data.data;
    })
}
