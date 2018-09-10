/**
 * Created by Micheal Xiao on 2017/8/23.
 */
import fetch from 'utils/fetch';
import {Message} from 'element-ui'

export function GetUserList(page) {
    let params;
    if(page){
        params = {
            page: page.page - 1,
            size: page.size,
            userName:page.userName,
            realName:page.realName,
            email:page.email,
            phone:page.phone,
            isEnable: page.isEnable
        }
    }
    return fetch({
        url: '/uaa/api/users',
        method: 'get',
        params: params
    }).then(function (result) {
        console.log("用户列表接口")
        console.log(result)
        return result
    })
}
export function CreateUser(data) {
    let postData = $.extend({},data,{
        password:encodeURIComponent(data.password)
    })
    return fetch({
        url: '/uaa/api/users',
        method: 'post',
        data: postData
    }).then(function (result) {
        Message({
            message: '创建用户成功',
            type: 'success',
            customClass:'msg-success',
            iconClass:'ic'
        })
        return result
    })
}

export function EditorUser(data) {
    let putData = $.extend({},data,{
        password:encodeURIComponent(data.password)
    })
    return fetch({
        url: '/uaa/api/users',
        method: 'put',
        data: putData
    }).then(function (result) {
        Message({
            message: '编辑用户成功',
            type: 'success',
            customClass:'msg-success',
            iconClass:'ic'
        })
        return result
    })
}

export function DeleteUser(id) {
    return fetch({
        url: '/uaa/api/users/' + id,
        method: 'delete',
    }).then(function (result) {
        console.log("删除用户接口")
        console.log(result)
        Message({
            message: '删除用户成功',
            type: 'success',
            customClass:'msg-success',
            iconClass:'ic'
        })
        return result
    })
}



export function ResetPassword(login) {
    return fetch({
        url: '/uaa/api/account/admin/reset_password',
        method: 'post',
        data:{
            "login": login,
            "password": "string"
        }
    }).then(function (result) {
        return result
    })
}

export function UnlockUser(login) {
    return fetch({
        url: '/uaa//api/users/un-lock/'+login,
        method: 'get'
    }).then(function (result) {
        return result
    })
}

//获取organization Name

export function GetOrganizationName(id) {
    return fetch({
        url: 'organization/api/organizations/' + id,
        method: 'get',
    }).then(function (result) {
        console.log("根据id获取organization 返回信息")
        console.log(result)
        return result
    })
}

// 获取角色列表
export function GetUsers(){
    return fetch({
        url: '/uaa/api/roles/datasource/select',
        method: 'get',
    }).then(function (result) {
        console.log("选择用户列表")
        console.log(result)
        // Message({
        //     message: '',
        //     type: 'success'
        // })
        return result
    })
}

export function ExportAll(page) {
    let dataParams;
    if(page){
        dataParams = {
            userName:page.userName,
            realName:page.realName,
            email:page.email,
            phone:page.phone,
            isEnable: page.isEnable
        }
    }
   let url = '/uaa/api/export/users?userName=' + dataParams['userName']+'&realName='+dataParams['realName']
        +'&email='+dataParams['email']+'&phone='+dataParams['phone']+'&isEnable='+dataParams['isEnable'];
    window.location.href = process.env.BASE_API + url;
}