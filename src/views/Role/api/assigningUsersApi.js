import fetch from  'utils/fetch';
import {Message} from 'element-ui';

/**
 * 未分配角色查询
 * @param data
 */
export function Unassigned(page) {
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
        url: '/api/auth/sys-user/searchList/addSystemRole?d='+new Date(),
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
        url: '/api/auth/sys-user/searchList/getByParam?d='+new Date(),
        method: 'post',
        // params: params,
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
        url: '/api/auth/saas-user-membership/insertData?d='+new Date(),
        method: 'POST',
        data: data
    }).then(function (result) {
        if(result){
            Message({
                message: '关联用户成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            })
        }

        return result;
    })
}


export function Delete(data) {
    return fetch({
        url: '/api/auth/saas-user-membership/delete' ,
        method: 'DELETE',
        data:data
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
/**
 * 获取组织用户
 * @param data
 * @constructor
 */
export function GetOrgStemUser(data) {
    return fetch({
        url: '/api/auth/sys-user/searchList/addSystemOrg' ,
        method: 'POST',
        data:data
    }).then(function (result) {
        return result.data;
    })
}

/**
 * 获取组织树   数据
 * @param data
 * @constructor
 */
export function GetOrgTree(data) {
    return fetch({
        url: '/api/auth/saas-organization/searchTree' ,
        method: 'POST',
        data:data
    }).then(function (result) {
        return result.data;
    })
}


