
import fetch from 'utils/fetch';
import {Message} from 'element-ui'

export function SetHumanAudit(data){
    return fetch({
        url: 'dealer/human-certificates-ref/set',
        method: 'POST',
        data: data
    }).then(function (response) {
        return response.data
    });
}

export function GetHumanAuditSetting(){
    return fetch({
        url: 'dealer/human-certificates-ref/getMust',
        method: 'GET'
    }).then(function (response) {
        return response.data
    });
}