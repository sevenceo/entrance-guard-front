
import fetch from 'utils/fetch';
import {Message} from "element-ui";

export function GetAllScene(id) {
    return fetch({
        url: 'dealer/scene/getSceneForCount/'+id,
        method: 'GET'
    }).then(function (response) {
        return response.data
    });
}

export function GetCountBySceneIds(param) {
    return fetch({
        url: 'monitoring/opendoor-history/getCountBySceneIds',
        method: 'POST',
        data:param
    }).then(function (response) {
        return response.data
    });
}

export function GetCountAndTimeBySceneIds(param) {
    return fetch({
        url: 'monitoring/opendoor-history/getCountAndTimeBySceneIds',
        method: 'POST',
        data:param
    }).then(function (response) {
        return response.data
    });
}