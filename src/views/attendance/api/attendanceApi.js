import fetch from 'utils/fetch';
import {Message} from 'element-ui'

//获取当前用户所管理的组织
export function getOrginations(){
    return fetch({
        url: 'dealer/resource/resourceList',
        method: 'POST',
        data: {}
    }).then(function (response) {
        return response.data
    });
}

export function Create(data) {
    return fetch({
        url: 'attendance/createAttenDanceGroup',
        method: 'POST',
        data: data
    }).then(function (result) {
        if (result) {
            Message({
                message: '创建考勤组成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            })
            return result.data
        }
    })
}


export function Search(page,parm){
    let size=page.size;
    let num=page.page;
    let data={
        name:parm.atnDanceName,
        resourceId:parm.resourceId,
        resourceIds:page.resourceIds
    }
    return fetch({
        url: 'attendance/searchAttenDance/'+size+'/'+num,
        method: 'POST',
        data: data
    }).then(function (result) {
        return result.data
    })
}

export function getById(id){
    return fetch({
        url: 'attendance/getAttenDanceGroup/'+id,
        method: 'get'
    }).then(function(result){
        return result.data;
    })
}

export function Update(data){
    return fetch({
        url: 'attendance/updateAttenDanceGroup',
        method: 'POST',
        data: data
    }).then(function (result) {
        if (result) {
            Message({
                message: '更新考勤组成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            })
            return result.data
        }
    })
}

export function BatchEnabled(ids){
    return fetch({
        url: '/attendance/enable',
        method: 'POST',
        data: ids
    }).then(function (result) {
            return result.data
    })
}

export function BatchDelete(ids){
    return fetch({
        url: 'attendance/deleteIds',
        method: 'POST',
        data: ids
    }).then(function (result) {
        return result.data
    })
}

export function getHumanByIds(ids){
    let data={
        humanIds:ids
    }
    return fetch({
        url: 'dealer/human/getHumanByIdsForAttendance',
        method: 'POST',
        data: data
    }).then(function (result) {
        return result.data
    })
}

//获取考勤人员
export function GetHuman(data){
    return fetch({
        url: 'attendance/getHuman/'+data.id+'/'+data.page+'/'+data.pageSize,
        method: 'GET'
    }).then(function (result) {
        return result.data
    })
}

//移除考勤人员
export function RestHuman(data){
    return fetch({
        url: 'attendance/reset',
        method: 'POST',
        data:data
    }).then(function (result) {
        return result.data
    })
}


