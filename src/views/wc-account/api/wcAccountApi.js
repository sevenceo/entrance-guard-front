/**
 * Created by Micheal Xiao on 2017/8/2.
 */
import fetch from 'utils/fetch';
// http://10.200.8.11:8010/wechat-account/
import axios from 'axios'


export function GetList(page) {
    let params;

    if (page) {
        params = {
            pageNum: page.page,
            pageSize: page.size,
            name: page.name,
            account: page.account,
            organizationId: page.organizationId,
            dbInstanceId: page.dbInstanceId
        }
    }

    return fetch({
        url: '/wechat-account/api/accounts',
        method: 'get',
        params: params,
    }).then(function (response) {
        console.log("获取微信公众号列表接口")
        console.log(response)
        for(let i in response.data){
            response.data[i].fullUrl = process.env.MATERIAL_API + response.data[i].headImgUrl
        }
        // console.log(response.headers)
        // console.log(response.headers('X-Total-Count'))
        return response
    })
}

//删
export function DeleteAccount(id) {
    return fetch({
        url: '/wechat-account/api/accounts/' + id,
        method: 'delete',
        data: id
    }).then(function (result) {
        console.log("删除成功")
        console.log(result)
        return result
    })

}

//增
export function CreateAccount(data) {
    let data1 = {
        "isInit": true,
        "isTokenCreating": true,
    }

    function extend(destination, source) {
        for (var property in source)
            destination[property] = source[property];
        return destination;
    }

    extend(data, data1)


    return fetch({
        url: '/wechat-account/api/accounts',
        method: 'post',
        data: data
    }).then(function (result) {
        console.log("创建活动信息接口 返回信息")
        console.log(result)
        return result
    })
}

//改
export function ModifyAccount(data) {
    return fetch({
        url: '/wechat-account/api/accounts',
        method: 'put',
        data: data
    }).then(function (result) {
        console.log("编辑活动信息接口 返回信息")
        console.log(result)
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


export function AvatarUpload(file) {
    let formData = new FormData();
    formData.append("file", file)
    return axios({
        method: 'post',
        url: process.env.BASE_API + '/wechat-account/api/accounts/headimg',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    })
        .then(function (result) {
            console.log("上传公众号头像接口")
            console.log(result)
            return result
        })
}

export function GetSelection(isFilter) {
    let data = {}
    if(isFilter === false){
        data={isFilter:false}
    }
    return fetch({
        url: '/datacenter/api/datasource/select',
        method: 'get',
        params: data,
    }).then(function (result) {
        console.log("获取数据库实例 返回信息")
        console.log(result)
        return result
    })
}

export function GetSelectionById(id) {
    return fetch({
        url: '/datacenter/api/db-instances/' + id,
        method: 'get',
    }).then(function (result) {
        console.log("根据ID数据库实例 返回信息")
        console.log(result)
        return result
    })
}

export function GetAllSelection() {

    return fetch({
        url: '/datacenter/api/db-instances',
        method: 'get'
    }).then(function (result) {
        return result
    })
}




