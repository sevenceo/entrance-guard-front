/**
 * Created by Micheal Xiao on 2017/6/19.
 */
import fetch from 'utils/fetch';

export function GetRolesList(page) {
    let params;
    if(page){
        params = {
            page:page.page - 1,
            size: page.size
        }
    }
    return fetch({
        url: process.env.BASE_API + '/uaa/api/roles',
        method: 'get',
        params: params
    }).then(function (result) {
        console.log("get roles API")
        console.log(result)
        return result
    })
}

export function GetRole(roleId) {
    return fetch({
        url: process.env.BASE_API + '/uaa/api/roles/' + roleId,
        method: 'get',
    }).then(function (result) {
        console.log("get role API")
        console.log(result)
        return result
    })
}

export function SetRoleAuthorities(roleId, data) {
    return fetch({
        url: process.env.BASE_API + '/uaa/api/roleAuthority/' + roleId,
        method: 'put',
        data:data
    }).then(function (result) {
        console.log("put role authorities API")
        console.log(result)
        return result
    })
}

// 创建角色
export function CreateRole(data) {
  return fetch({
    url: process.env.BASE_API + '/uaa/api/roles',
    method: 'post',
    data:data
  }).then(function (result) {
    console.log("create role API")
    console.log(result)
    return result
  })
}

// 删除角色 根据ID
export function DeleteRole(id) {
  return fetch({
    url: process.env.BASE_API + '/uaa/api/roles/' + id,
    method: 'delete',
  }).then(function (result) {
    console.log("delete role API")
    console.log(result)
    return result
  })
}

// 编辑角色信息
export function UpdateRole(data) {
  return fetch({
    url: process.env.BASE_API +'/uaa/api/roles',
    method: "put",
    data: data,
  }).then(function (result) {
    console.log("update role API");
    console.log(result)
    return result
  })
}
