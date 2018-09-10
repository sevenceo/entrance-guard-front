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
        url: '/api/auth/sys-user/searchList',
        method: 'POST',
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
        url: '/api/auth/sys-user?d=' + new Date(),
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

export function Editor(data) {
    return fetch({
        url: '/api/auth/sys-user/' + data.id,
        method: 'PATCH',
        data: data
    }).then(function (result) {

        return result;
    })
}

export function Delete(id) {
    return fetch({
        url: '/api/auth/auth/role/' + id,
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

/**
 * 重置密码
 * @param id
 * @constructor
 */
export function ResetPassword(id) {
    return fetch({
        url: '/api/auth/sys-user/resetPassward/' +id,
        method: 'PUT',
        data: {}
    }).then(function (result) {
        Message({
            message: '重置成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        });
        return result.data;
    })
}
/**
 * 根据用户Id获取用户的组织角色关系
 * @param id
 */
export function ListQuery(id) {
    return fetch({
        url: '/api/auth/saas-user-membership/listQuery/' + id,
        method: 'GET',
    }).then(function (result) {
        return result.data;
    })
}

/**
 * 根据角色类型查询角色下级所有该角色类型
 * @param data
 */
export function GetByRoleType(data) {
    return fetch({
        url: '/api/auth/auth/roleType/roleTypeData?d='+new Date(),
        method: 'POST',
        data:data
    }).then(function (result) {
        return result.data;
    })
}
/**
 * 分配角色
 * @param data
 * @constructor
 */
export function RoleSave(data) {
    return fetch({
        url: '/api/auth/sys-user/roleSave/'+data.id,
        method: 'PATCH',
        data:data
    }).then(function (result) {
        return result.data;
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
        url: '/api/auth/permit/ids/role/'+id,
        method: 'GET',
    }).then(function (result) {
        return result.data;
    })
}

/**
 * 分配权限
 * @constructor
 */
export function UpdateAuth(id,data) {
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
 * 分配资源
 */
export function CreateSysResource(data) {
    return fetch({
        url: 'dealer/insert/sysresource',
        method: 'POST',
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
 * 根据sys_id查询用户拥有什么资源
 */
export function SelectBySysId(id) {
    return fetch({
        url: 'dealer/select/sysresource/'+id,
        method: 'GET',
    }).then(function (result) {
        return result.data;
    })
}

/**
 * 根据
 * @constructor
 */
export function ResourceList(data){
    return fetch({
        url: 'dealer/resource/resourceList',
        method: 'POST',
        data: data
    }).then(function(result){
        return result;
    })
}
