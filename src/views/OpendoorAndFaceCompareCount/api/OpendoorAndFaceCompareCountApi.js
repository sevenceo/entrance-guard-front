import fetch from 'utils/fetch';
import axios from 'axios';
import {Message} from "element-ui";
import {ExportData} from 'src/api/exportData'

export function GetList(pageParam) {
    return fetch({
        /*url: 'dealer/face-compare-history/getOpendoorAndFaceCompareGroupByScene',*/
        url: 'dealer/face-compare-history/getStatistics',
        method: 'POST',
        data:pageParam
    }).then(function (response) {
        return response.data
    });
}

export function GetList1(pageParam) {
    return fetch({
        url: 'dealer/face-compare-history/getOpendoorAndFaceCompareGroupBySceneOrderByTotal',
        method: 'POST',
        data:pageParam
    }).then(function (response) {
        return response.data
    });
}

export function ExportExcel(beginTime,type,order) {
    const link = document.createElement('a')
    link.download = "开门统计.xls"
    link.href = 'download/face-compare-history/exportExcelFromES/'+ beginTime + '/'+ type + '/' + order
    link.click()
}