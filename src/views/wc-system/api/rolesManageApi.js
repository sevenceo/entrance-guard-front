/**
 * Created by Micheal Xiao on 2017/8/16.
 */
import fetch from 'utils/fetch';
import axios from 'axios'
import {Message} from 'element-ui';
export function GetList(page) {
    let params;

    if(page){
        params = {
            pageNum:page.page,
            pageSize: page.size,
            name: page.name,
            type: page.type
        }
    }

    return fetch({
        url: '/uaa/api/roles',
        method: 'get',
        params: params,
    }).then(function (response) {
        console.log("获取角色列表接口")
        console.log(response)
        return response
    })
}
export function GetRoleList(page) {
    let params;

    if(page){
        params = {
            page:page.page,
            size: page.size,
            name: page.name,
            type: page.type
        }
    }
    return fetch({
        url: 'uaa/api/roles',
        method: 'get',
        params:params
    }).then(function (response) {
        console.log("获取ROLE列表接口")
        console.log(response)
        return response
    })
}

export function GetCheckboxModules() {
    return fetch({
        url: '/uaa/api/roles/modules',
        method: 'get',
    }).then(function (response) {
        console.log("获取 checkbox module 列表接口")
        console.log(response)
        return response
    })
}

export function GetRole(id) {
    // console.log(id)
    return fetch({
        url: '/uaa/api/roles/' + id,
        method: 'get',
    }).then(function (response) {
        console.log("根据ID获取角色信息接口")
        console.log(response)
        return response
    })
}

//删
export function DeleteRole(id) {
    return fetch({
        url: '/uaa/api/roles/' + id,
        method: 'delete',
    }).then(function (result) {
        console.log("删除成功")
        console.log(result)
        return result
    })

}

//增
export function CreateRole(data) {

    let data1 = {
        "organizationId": "",
        "status": "NORMAL",
        "isDefault": true,
        "permitLevel": 4,
        "description": "This is T1e1st Role",
        "authorities": ["ROLE_USER"]
    }
    let data2 = $.extend(data1, data)

    console.log(data2)

    return fetch({
        url: '/uaa/api/roles',
        method: 'post',
        data: data2
    }).then(function (result) {
        console.log("创建角色接口")
        console.log(result)
        Message({
            message: '创建成功',
            type: 'success',
            customClass:'msg-success',
            iconClass:'ic'
        })
        return result
    })
}

//改
export function EditorRole(data) {

    let data1 = {
        "organizationId": "",
        "status": "NORMAL",
        "isDefault": true,
        "permitLevel": "CustomUser",
        "description": "This is T1e1st Role",
        "authorities": ["ROLE_USER"]
    }
    let data2 = $.extend(data1, data)

    return fetch({
        url: '/uaa/api/roles',
        method: 'put',
        data: data
    }).then(function (result) {
        console.log("编辑角色接口")
        console.log(result)
        Message({
            message: '编辑成功',
            type: 'success',
            customClass:'msg-success',
            iconClass:'ic'
        })
        return result
    })
}

export function AvatarUpload(file) {
    let formData = new FormData();
    formData.append("file", file)
    return axios({
        method: 'post',
        url: process.env.BASE_API + '/wechat-account/api/accounts/headimg',
        data: formData,
        headers:{'Content-Type': 'multipart/form-data'}
    })
        .then(function (result) {
            console.log("上传公众号头像接口")
            console.log(result)
            return result
        })
}




