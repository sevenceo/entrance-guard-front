import fetch from 'utils/fetch';
import {Message} from 'element-ui'

export function Create(data){
    return fetch({
        url:'attendance/schedule',
        method:'POST',
        data:data
    }).then(function(resp){
        return resp.data;
    })
}

export function Update(data){
    return fetch({
        url:'attendance/schedule/'+data.id,
        method:'PUT',
        data:data
    }).then(function(resp){
        return resp.data;
    })
}

export function Search(page,data){
    return fetch({
        url:'attendance/schedule/search/'+page.size+'/'+page.page,
        method:'POST',
        data:data
    }).then(function(resp){
        return resp.data;
    })
}

export function bathEnable(ids){
    return fetch({
        url:'attendance/schedule/enable',
        method:'post',
        data:ids
    }).then(function(resp){
        return resp.data;
    })
}

export function bathDisable(ids){
    return fetch({
        url:'attendance/schedule/disable',
        method:'post',
        data:ids
    }).then(function(resp){
        return resp.data;
    })
}

export function bathDelete(ids){
    return fetch({
        url:'attendance/schedule/delete',
        method:'post',
        data:ids
    }).then(function(resp){
        return resp.data;
    })
}

export function getGroup(id){
    let data={
        resourceId:id
    }
    return fetch({
        url:'attendance/selectByOrdIds',
        method:'post',
        data:data
    }).then(function(resp){
        return resp.data;
    })
}