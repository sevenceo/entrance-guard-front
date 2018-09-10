import fetch from  'utils/fetch';
import {Message} from 'element-ui';

/**
 * 未分配角色查询
 * @param data
 */
export function Unassigned(page) {
    return fetch({
        url: '/api/auth/sys-user/searchList/addOrgUser?d='+new Date(),
        method: 'post',
        // params: params,
        data:page
    }).then(function (result) {
        return result.data;
    })
}



/**
 * 已分配角色查询
 * @param data
 */
export function AlreadyAssigned(page) {
    let params;

    return fetch({
        url: '/api/auth/saas-user-organization/searchList?d='+new Date(),
        method: 'post',
        data:page
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
        url: '/api/auth/saas-user-organization/insertData?d='+new Date(),
        method: 'POST',
        data: data
    }).then(function (result) {
        Message({
            message: '创建用户成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result;
    })
}


export function Delete(id) {
    return fetch({
        url: '/api/auth/saas-user-organization/'+id ,
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
