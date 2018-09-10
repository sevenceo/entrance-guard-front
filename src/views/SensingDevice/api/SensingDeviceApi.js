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
import {Message} from 'element-ui'

export function GetList(page) {
    let params;
    if (page) {
        params = $.extend({
            //分页信息
            page: page.page,
            pageNum: page.page,
            pageSize: page.size,

            aiServerId:page.aiServerId,
            ip:page.ip,
        }, page);
    }
    page.type=2
    return fetch({
        url: 'dealer/sensing-device/page',
        method: 'POST',
        data: page
    }).then(function (response) {
        return response.data
    });
}


export function GetAiServerList(page) {
    let params;
    if (page) {
        params = $.extend({
            //分页信息
            page: page.page,
            pageNum: page.page,

        }, page);
    }
     page.pageSize=10000
    return fetch({
        url: 'dealer/ai-server/search',
        method: 'POST',
        data: page
    }).then(function (response) {
        return response.data
    });
}

export function GetByIdControlList(param) {
    return fetch({
        url: 'dealer/control-device/controlDeviceInfo',
        method: 'POST',
        data: param
    }).then(function (response) {
        return response.data
    });
}
export function InfoInsertBatch(param) {
    return fetch({
        url: 'dealer/sensing-control-ref/infoInsertBatch',
        method: 'POST',
        data: param
    }).then(function (result) {
        Message({
            message: '批量关联门禁成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}

export function DetailDelete(param) {
    return fetch({
        url: 'dealer/sensing-control-ref/conditionsToDelete',
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

export function Create(data) {
    return fetch({
        url: 'dealer/sensing-device',
        method: 'POST',
        data: data
    }).then(function (result) {
        if (result) {
            Message({
                message: '创建感应设备成功',
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
        url: 'dealer/sensing-device/' + data.id,
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
        url: 'dealer/sensing-device/' + id,
        method: 'DELETE',
    }).then(function (result) {
        Message({
            message: '删除感应设备成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}

export function BatchDelete(ids) {
    return fetch({
        url: 'dealer/sensing-device/delete',
        method: 'POST',
        data: ids
    }).then(function (result) {
        Message({
            message: '批量删除感应设备成功',
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
            url: 'dealer/sensing-device/disable/' + id,
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
            url: 'dealer/sensing-device/enable/' + id,
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
            url: 'dealer/sensing-device/disable',
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
            url: 'dealer/sensing-device/enable',
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

export function ResourceSensingDeviceRefInsertBatch(id,tenantId) {
    return fetch({
        url: 'dealer/sensing-device/associate/'+id,
        method: 'PATCH',
        data: {"orgId":tenantId}
    }).then(function (response) {
        Message({
            message: '关联成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return response.data
    });
}

export function GetRescourceBySensingDeviceId(id) {
    return fetch({
        url: 'dealer/ld-server/getOrg/'+id,
        method: 'POST',
        data : {'type': 2}
    }).then(function (response) {
        return response.data
    });
}

export function GetCommunityList(id) {
    return fetch({
        url: 'dealer/ld-server/getCommunityList/'+id,
        method: 'POST',
        data : {'type': 2}
    }).then(function (response) {
        return response.data
    });
}

export function CancleAssociate(id) {
    return fetch({
        url: 'dealer/sensing-device/cancleAssociate/' + id,
        method: 'PATCH'
    }).then(function (result) {
        if (result) {
            Message({
                message: '删除成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            })
            return result.data
        }
    })
}

export function GetAllOrgs() {
    return fetch({
        url: '/dealer/ld-server/getAllOrgs',
        method: 'GET'
    }).then(function (result) {
        return result.data;
    })
}