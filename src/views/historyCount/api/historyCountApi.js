import fetch from 'utils/fetch';
import {Message} from "element-ui";
import {ExportData} from 'src/api/exportData'

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

export function GetHistoryCountAndTimeBySceneIds(param) {
    return fetch({
        url: 'monitoring/opendoor-history/getHistoryCountAndTimeBySceneIds',
        method: 'POST',
        data:param
    }).then(function (response) {
        return response.data
    });
}

export function ExportNewsTableData(sceneIds,searchData) {
    console.log('');

    let url = '/export/opendoor-history/exportCountByDate/'+sceneIds+'/'+searchData;
    // ExportData(url,'post',param,"历史数据统计.xlsx")


    window.location.href =url
    /*return fetch({
        url: 'dealer/opendoor-history/exportCountByDate',
        method: 'POST',
        // params: method.toLowerCase() === 'get' ? params : null,
        data: param,
        responseType: "blob"
    }).then(res => {

        let saveFileName = "历史数据统计.xlsx";
        var fileDownload = require('js-file-download');
        fileDownload(res.data, saveFileName);
    }).catch(error => {
        console.error(error)
        Message({
            message: "数据导出异常",
            type: 'error',
            customClass: 'msg-error',
            iconClass: 'ic'
        })
    })*/
}