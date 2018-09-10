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
  * 创建日期：2018-7-12
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
        url: 'dealer/prompt-manage/page',
        method: 'POST',
        data: page
    }).then(function (response) {
        return response.data
    });
}

export function Create(data) {
    return fetch({
        url: 'dealer/prompt-manage',
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

export function Editor(data) {
    return fetch({
        url: 'dealer/prompt-manage/' + data.id,
        method: 'PATCH',
        data: data
    }).then(function (result) {
        if (result) {
            Message({
                message: '编辑成功',
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
        url: 'dealer/prompt-manage/' + id,
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
        url: 'dealer/prompt-manage/delete',
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

export function Status(id, type) {
    if (type == '1') {
        return fetch({
            url: 'dealer/prompt-manage/disable/' + id,
            method: 'GET',
        }).then(function (result) {
            Message({
                message: '禁用成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            })
            return result
        })
    } else if (type == '0') {
        return fetch({
            url: 'dealer/prompt-manage/enable/' + id,
            method: 'GET',
        }).then(function (result) {
            Message({
                message: '启用成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            })
            return result
        })
    }
}

export function BatchStatus(ids, type) {
    if (type == '1') {
        return fetch({
            url: 'dealer/prompt-manage/disable',
            method: 'POST',
            data: ids
        }).then(function (result) {
            Message({
                message: '批量禁用成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            })
            return result
        })
    } else if (type == '0') {
        return fetch({
            url: 'dealer/prompt-manage/enable',
            method: 'POST',
            data: ids
        }).then(function (result) {
            Message({
                message: '批量启用成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            })
            return result
        })
    }
}

export function GetPromptTypes() {
        return fetch({
            url: 'dealer/dictionary/searchByStyle/'+5,
            method: 'GET',
        }).then(function (result) {
            return result.data;
        })
}

export function GetHuman(humanPageParam) {
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
            url: 'dealer/human/promptManageHumans',
            method: 'POST',
            data: humanPageParam
        }).then(function (result) {
            return result.data;
        })
}

export function GetPromptHumanGroup(humanPageParam) {
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
            url: 'dealer/group-human/promptPage',
            method: 'POST',
            data: humanPageParam
        }).then(function (result) {
            return result.data;
        })
}

export function DeleteHumanRef(param) {
      return fetch({
            url: 'dealer/prompt-manage/deleteHumanRef',
            method: 'POST',
            data: param
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

export function DeleteGroupRef(param) {
      return fetch({
            url: 'dealer/prompt-manage/deleteGroupRef',
            method: 'POST',
            data: param
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

export function SendData(param) {
      return fetch({
            url: 'dealer/prompt-manage/sendData',
            method: 'POST',
            data: param
        }).then(function (result) {
          Message({
              message: '下发成功',
              type: 'success',
              customClass: 'msg-success',
              iconClass: 'ic'
          })
          return result
        })
}