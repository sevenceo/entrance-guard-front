/**
 * Created by xinquan.yu on 2017/6/6.
 */
import fetch from 'utils/fetch';

export function GetUserList(page) {
  let params;
  if(page){
    params = {
      page:page.page - 1,
      size: page.size
    }
  }
  return fetch({
    url: process.env.BASE_API + '/uaa/api/activatedUsers',
    method: 'get',
    params: params
  }).then(function (result) {
    console.log("用户管理列表接口 返回信息")
    console.log(result)
    return result
  })
}

// 删除用户
export function DeleteUsers(login) {
  return fetch({
    url: process.env.BASE_API + '/uaa/api/users/'+ login,
    method: 'delete',
  }).then(function (result) {
    console.log("删除用户信息接口 返回信息")
    console.log(result)
    return result
  })
}

// 添加新用户
export function CreateUser(data) {
  return fetch({
    url: process.env.BASE_API + '/uaa/api/users',
    method: 'post',
    data: data
  }).then(function (result) {
    console.log("创建用户接口 返回信息")
    console.log(result)
    return result
  })
}

// 按照用户名查询用户信息
export function GetUsers(login) {
  return fetch({
    url: process.env.BASE_API + '/uaa/api/users/'+ login,
    method: 'get',
  }).then(function (result) {
    console.log("得到用户信息接口 返回信息")
    console.log(result)
    return result
  })
}
//更新用户的角色信息
export function SetUserRoles(login, data){
  return fetch({
    url:process.env.BASE_API + '/uaa/api/v2/user_roles/'+ login,
    method: 'put',
    data: data
  }).then(function (result) {
    console.log("更新用户角色信息 返回信息");
    console.log(result)
    return result
  })
}
