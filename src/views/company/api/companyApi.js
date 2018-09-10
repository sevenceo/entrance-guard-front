/**
 *  基础数据
 */
import fetch from 'utils/fetch';

export function SearchDataList(page) {
    return fetch({
        url: 'api/auth/saas-corporation/searchList',
        method: 'post',
        params: page
    }).then(function (response) {
        //console.log(response)
        return response
    })
}
export function CreateData(data) {
    let param = {
        'corpName':data.corpName,
        'CorpCode':data.CorpCode
    };
    return fetch({
        url: '/basicdata/api/company',
        method: 'post',
        data: param
    }).then(function (result) {
        return result
    })
}
export function ModifyData(data) {
    return fetch({
        url: '/basicdata/api/company',
        method: 'put',
        data: data
    }).then(function (result) {
        return result
    })
}

export function Deletebrand(id) {
    return fetch({
        url: '/basicdata/api/brand/'+ id,
        method: 'delete'
    }).then(function (result) {
        return result
    })
}

export function GetDataById(id) {
    return fetch({
        url: '/basicdata/api/brand/' + id,
        method: 'get',
    }).then(function (result) {
        return result
    })
}





