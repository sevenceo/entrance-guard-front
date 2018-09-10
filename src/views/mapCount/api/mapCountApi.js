import fetch from 'utils/fetch';
import {Message} from "element-ui";

export function GetAllScene() {
    return fetch({
        url: 'dealer/scene/getSceneForCount',
        method: 'POST'
    }).then(function (response) {
        return response.data
    });
}

export function GetCountBySceneIds(param) {
    return fetch({
        url: 'dealer/opendoor-history/getCountBySceneIds',
        method: 'POST',
        data:param
    }).then(function (response) {
        return response.data
    });
}

export function GetCountAndTimeBySceneIds(param) {
    return fetch({
        url: 'dealer/opendoor-history/getCountAndTimeBySceneIds',
        method: 'POST',
        data:param
    }).then(function (response) {
        return response.data
    });
}




/*------------------*/

export function GetAllDetail() {
    return fetch({
        url: 'dealer/resource-detail/getAll',
        method: 'GET'
    }).then(function (response) {
        return response.data
    });
}

export function GetCount() {
    return fetch({
        url: 'dealer/echarts/map/count',
        method: 'GET'
    }).then(function (response) {
        return response.data
    });
}

export function GetResourceCount(data) {
    return fetch({
        url: 'dealer/echarts/map/resourceCount',
        method: 'POST',
        data: data
    }).then(function (response) {
        return response.data
    });
}

export function GetDeviceDetailDataById(sceneId, code) {
    return fetch({
        url: '/monitoring/opendoor-early-warning/getEsDetail/'+sceneId+"/"+code,
        method: 'GET'
    }).then(function (result) {
        return result.data
    })
}

