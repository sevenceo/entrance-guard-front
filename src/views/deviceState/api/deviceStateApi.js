/**************************************************************************/
/*                                                                        */
/* Copyright (c) 2017 HyperSmart Company                                  */
/* 深圳市超智慧信息科技有限公司版权所有                                     */
/*                                                                        */
/* PROPRIETARY RIGHTS of HyperSmart Company are involved in the           */
/* subject matter of this material. All manufacturing, reproduction, use, */
/* and sales rights pertaining to this subject matter are governed by the */
/* license agreement. The recipient of this software implicitly accepts   */
/* the terms of the license.                                              */
/* 本软件文档资料是深圳市超智慧信息科技有限公司的资产，任何人士阅读和        */
/* 使用本资料必须获得相应的书面授权，承担保密责任和接受相应的法律约束。      */
/*                                                                        */
/**************************************************************************/

/**
  * <pre>
  * 作   者：胡跃峥
  * 创建日期：2018-4-8
  * </pre>
  */

import fetch from 'utils/fetch';

export function GetList(page) {
    let params;
    if (page) {
        params = $.extend({
            //分页信息
            page: page.page,
            pageNum: page.page,
            pageSize: page.size,
        }, page);
    }

    return fetch({
        url: 'dealer/device-state/page',
        method: 'POST',
        data: params
    }).then(function (response) {
        return response.data
    });
}
export function GetDeviceStateById(id) {
    return fetch({
        url: 'dealer/device-state/get/'+id,
        method: 'GET'
    }).then(function (response) {
        return response.data
    });
}

export function GetResourceTree() {
    return fetch({
        url: 'dealer/face-compare-history/getCorpAndOrg',
        method: 'GET',
    }).then(function (result) {
        return result.data;
    })
}

export function GetSceneList(id,roleType) {
    return fetch({
        url: 'dealer/face-compare-history/getSceneList/'+ roleType + '/'+ id,
        method: 'GET',
    }).then(function (result) {
        return result.data;
    })
}

export function GetIdServerIpList(id,roleType) {
    return fetch({
        url: 'dealer/ld-server/getLdServerIpList/'+ roleType + '/'+ id,
        method: 'GET',
    }).then(function (result) {
        return result.data;
    })
}
export function GetHistoryDeviceState(page) {
    return fetch({
        url: 'monitoring/device-state/getDeviceStates',
        method: 'POST',
        data: page
    }).then(function (response) {
        return response.data
    });
}