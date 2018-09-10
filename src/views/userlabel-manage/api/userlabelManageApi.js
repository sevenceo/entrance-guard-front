/**
 * Created by zyk on 2017/9/18.
 */

import fetch from 'utils/fetch';
import axios from 'axios';

export function SearchDataList(page) {
    let params;
    params = $.extend({},page);
    params.validateStart = getDate(params.validateStart);
    params.validateEnd = getDate(params.validateEnd);
    params.runTimeStart = getDate(params.runTimeStart);
    params.runTimeEnd = getDate(params.runTimeEnd);

    return fetch({
        url:'/wechat-userlabel/api/tag/search',
        method: 'post',
        params: params
    }).then(function (response) {
        return response
    })
}
export function GetTreeData() {
    return fetch({
        url:'/wechat-userlabel/api/tag',
        method: 'get'
    }).then(function (response) {
        return response
    })
}

export function CreateData(data) {

    let params = $.extend({},data);
    params.validateStart = getDate(params.validateStart);
    if(params.validateStart) {
        params.validateStart = params.validateStart +"T10:10:10";
    }
    params.validateEnd = getDate(params.validateEnd);
    if(params.validateEnd) {
        params.validateEnd = params.validateEnd + "T10:10:10";
    }
    return fetch({
        url: '/wechat-userlabel/api/tag',
        method: 'post',
        data: params
    }).then(function (result) {
        return result
    })
}

export function GetDataById(id) {
    return fetch({
        url: '/wechat-userlabel/api/tag/' + id,
        method: 'get',
    }).then(function (result) {
        return result
    })
}

export function ModifyData(data) {
    let params = $.extend({},data);
    params.validateStart = getDate(params.validateStart);
    if(params.validateStart) {
        params.validateStart = params.validateStart + "T10:10:10";
    }
    params.validateEnd = getDate(params.validateEnd);
    if(params.validateEnd) {
        params.validateEnd = params.validateEnd + "T10:10:10";
    }
    return fetch({
        url: '/wechat-userlabel/api/tag',
        method: 'put',
        data: params
    }).then(function (result) {
        return result
    })
}

// 获取上传文件
export function UploadFile(file) {
    let formData = new FormData();
    formData.append("file", file,encodeURI(file.name));
    return axios({
        method: 'post',
        url: process.env.BASE_API + '/wechat-userlabel/api/file/upload',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then(function (result) {
        return result
    })
}

// 获取上传文件
export function CountUserLabel(selectedData,account) {
    let params = $.extend({},selectedData);
    for(let i in params) {
        if(params[i].state == '启用') {
            params[i].state = 'ON';
        } else {
            params[i].state = 'OFF';
        }
    }
    return fetch({
        method: 'post',
        url: '/wechat-userlabel/api/time_task/tag/'+account,
        data: selectedData
    }).then(function (result) {
        return result
    })
}

export function DeleteFile(url) {
    let group= url.substring(url.indexOf('=')+1,url.indexOf('&'));
    let path = url.substring(url.indexOf('&')+6,url.lastIndexOf('&'));
    url = group+"/"+path;
    return fetch({
        method: 'delete',
        url: process.env.BASE_API + '/wechat-userlabel/api/file/delete',
        params:{'url':url}
    }).then(function (result) {
        return result
    })
}

function getDate(date) {
    "use strict";
    if(date) {
        if(typeof(date) == 'string') {
            date = new Date(date);
        }
        var year = date.getFullYear();
        var month = ((date.getMonth() + 1) < 10 ? "0" : "")+(date.getMonth() + 1);
        var day = (date.getDate() < 10 ? "0" : "")+date.getDate();
        return year + "-" + month + "-" + day;
    }
    return date;
}

export function GetFansList(page) {
    let account = page.account;
    let id = page.id;
    let params;
    if(page){
        params = {
            page: page.page - 1,
            size: page.size
        }
    }
    return  fetch({
        url: '/wechat-userlabel/api/tag/fans/'+account+"/"+id,
        method: 'get',
        params: params
    }).then(function (result) {
        // console.log("粉丝列表接口")
        return result
    })
}

export function ExportAll(account,id) {
    let url = '/wechat-userlabel/api/tag/exportFansExcel/'+account+'/'+id;
     window.location.href = process.env.BASE_API + url;
}



