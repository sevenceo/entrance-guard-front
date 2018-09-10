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
import {Message} from "element-ui";

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
        url: 'dealer/visitor-record/cloudPage',
        method: 'POST',
        data: params
    }).then(function (response) {
        return response.data
    });
}

export function GetResourceOrgList() {
    return fetch({
        url: 'dealer/resource/getResourceOrgList',
        method: 'POST'
    }).then(function (response) {
        return response.data
    });
}

export function AddVistorRecord(param) {
    return fetch({
        url: 'dealer/visitor-record/add',
        method: 'POST',
        data: param
    }).then(function (result) {
        return result
    })
}

export function EditorVisitorRecord(param) {
    return fetch({
        url: 'dealer/visitor-record/update/'+param.id,
        method: 'POST',
        data: param
    }).then(function (result) {
        Message({
            message: '新增成功',
            type: 'success'
        })
        return result
    })
}

export function GetFacePhotoByPhone(phone) {
    return fetch({
        url: 'dealer/visitor-record/getFacePhote/'+phone,
        method: 'GET',
    }).then(function (result) {
        return result;
    })
}