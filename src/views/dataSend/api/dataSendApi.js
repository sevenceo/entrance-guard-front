import fetch from 'utils/fetch';

export function getCommunity() {
    return fetch({
        url: '/dealer/resource/getCommunity',
        method: 'GET'
    }).then(function (response) {
        return response.data
    });
}

export function dataSend(resourceId,serverId) {
    return fetch({
        url: '/dealer/dataIssue/'+resourceId+'/'+serverId,
        method: 'GET',
    }).then(function (response) {
        return response.data
    });
}
