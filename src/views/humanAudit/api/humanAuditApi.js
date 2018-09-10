
import fetch from 'utils/fetch';
import {Message} from 'element-ui'

export function GetList(page){
    let params;
    if (page) {
        params = $.extend({
            //分页信息
            page: page.page,
            pageNum: page.page,
            pageSize: page.size,

            //查询条件
            realName: page.realName,
            mobilePhone: page.mobilePhone,
            gender: page.gender,
            email: page.email,
        }, page);
    }

    return fetch({
        url: 'dealer/human-certificates-ref/unAuditPage',
        method: 'POST',
        data: page
    }).then(function (response) {
        return response.data
    });
}

export function audit(id,communityId){
    let param = {
        id:id,
        communityId:communityId
    }
    return fetch({
        url: 'dealer/human-certificates-ref/audit',
        method: 'POST',
        data: param
    }).then(function (response) {
        return response.data
    });
}

export function Reject(param){
    return fetch({
        url: 'dealer/human-certificates-ref/reject',
        method: 'POST',
        data: param
    }).then(function (response) {
        return response.data
    });
}

export function GetResourceTree(){
    return fetch({
        url: 'dealer/resource/resourceList',
        method: 'POST',
        data: {}
    }).then(function (response) {
        return response.data
    });
}

export function GetResourceTypeByResourceId(id){
    return fetch({
        url: 'dealer/resource/getResourceTypeByResourceId/'+id,
        method: 'get',
    }).then(function (response) {
        return response.data
    });
}

export function GetResourceName(id){
    return fetch({
        url: 'dealer/resource/getResourceName/'+id,
        method: 'get',
    }).then(function (response) {
        return response.data
    });
}