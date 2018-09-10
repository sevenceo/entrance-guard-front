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
  * 作   者：Allison
  * 创建日期：2018-7-20
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
        url: 'dealer/white-list/page',
        method: 'POST',
        data: page
    }).then(function (response) {
        return response.data
    });
}

export function Create(data) {
    return fetch({
        url: 'dealer/white-list',
        method: 'POST',
        data: data
    }).then(function (result) {
        if (result) {
            Message({
                message: '创建成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            })
            return result.data
        }
    })
}

export function Delete(id) {
    return fetch({
        url: 'dealer/white-list' + id,
        method: 'DELETE',
    }).then(function (result) {
        Message({
            message: '删除成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}

export function BatchDelete(ids) {
    return fetch({
        url: 'dealer/white-list/delete',
        method: 'POST',
        data: ids
    }).then(function (result) {
        Message({
            message: '批量删除成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}

export function GetOutWhiteListHuman(humanPageParam) {
    let params;
    if (humanPageParam) {
        params = $.extend({
            //分页信息
            page: humanPageParam.page,
            pageNum: humanPageParam.page,
            pageSize: humanPageParam.size,
        }, humanPageParam);
    }

    return fetch({
        url: 'dealer/white-list/getOutWhiteListHuman',
        method: 'POST',
        data: humanPageParam
    }).then(function (result) {
        return result.data;
    })
}

export function CreateNewHuman(data) {

    return fetch({
        url: 'dealer/white-list/addHuman',
        method: 'POST',
        data: data
    }).then(function (result) {
        console.log(result);
        return result.data
    })
}