/**
 *  基础数据
 */
import fetch from 'utils/fetch';

export function SearchDataList(page) {
    return fetch({
        url: '/basicdata/api/carseries/search',
        method: 'post',
        params: page
    }).then(function (response) {
        return response
    })
}
export function CreateData(data) {
    let param = {
        'name':data.name,
        'enName':data.enName,
        'code':data.code,
        'status':data.status,
        'brandId':data.brandId
    };
    return fetch({
        url: '/basicdata/api/carseries',
        method: 'post',
        data: param
    }).then(function (result) {
        return result
    })
}
export function ModifyData(data) {
    return fetch({
        url: '/basicdata/api/carseries',
        method: 'put',
        data: data
    }).then(function (result) {
        return result
    })
}

export function DeleteCarSeries(id) {
    return fetch({
        url: '/basicdata/api/carseries/'+ id,
        method: 'delete'
    }).then(function (result) {
        return result
    })
}

export function GetDataById(id) {
    return fetch({
        url: '/basicdata/api/carseries/' + id,
        method: 'get',
    }).then(function (result) {
        return result
    })
}export function GetAllBrand() {
    return fetch({
        url: 'basicdata/api/brand/search',
        method: 'post'
    }).then(function (result) {
        return result
    })
}

export function ExportAll(page) {
    let dataParams;
    if(page){
        dataParams = {
            code:page.code,
            enName:page.enName,
            name:page.name,
            status:page.status,
            brandId: page.brandId
        }
    }
    let url = '/basicdata/api/carseries/export?code=' + dataParams['code']+'&enName='+dataParams['enName']
     +'&name='+dataParams['name']+'&status='+dataParams['status']+'&brandId='+dataParams['brandId'];
     window.location.href = process.env.BASE_API + url;
}







