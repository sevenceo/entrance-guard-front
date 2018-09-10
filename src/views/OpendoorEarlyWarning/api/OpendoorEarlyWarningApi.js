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
  * 创建日期：2018-7-26
  * </pre>
  */

import fetch from 'utils/fetch';
import {Message} from 'element-ui'

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
        url: '/monitoring/opendoor-early-warning/page',
        method: 'POST',
        data: page
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

export function GetDeviceDetailLogDataById(sceneId, tenantId, type) {
    return fetch({
        url: '/monitoring/device-log/page',
        method: 'POST',
        data:{"page":1, "level": type, "tenantId": tenantId, "isYj": "1"}
    }).then(function (result) {
        return result.data
    })
}
