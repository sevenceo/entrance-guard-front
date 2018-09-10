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
  * 创建日期：2018-4-10
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

            groupName:page.groupName
        }, page);
    }

    return fetch({
        url: 'dealer/group-human/page',
        method: 'POST',
        data: page
    }).then(function (response) {
        return response.data
    });
}

export function GetPageByIdHumanList(page) {
    let params;
    if (page) {
        params = $.extend({
            //分页信息
            page: page.page,
            pageNum: page.page,
            pageSize: page.size,
            groupName:page.groupName
        }, page);
    }
    return fetch({
        url: 'dealer/human/pageHumanInfo',
        method: 'POST',
        data: page
    }).then(function (response) {
        return response.data
    });
}

export function GetByIdHumanList(param) {
    return fetch({
        url: 'dealer/human/humanInfo',
        method: 'POST',
        data: param
    }).then(function (response) {
        return response.data
    });
}
export function DetailDelete(param) {
    return fetch({
        url: 'dealer/human-group-ref/humanGroupDelete',
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

export function HumanGroupInsertBatch(param) {
    return fetch({
        url: 'dealer/human-group-ref/infoInsertBatch',
        method: 'POST',
        data: param
    }).then(function (result) {
        Message({
            message: '批量添加人员成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}
export function GetByIdSenceList(param) {
    return fetch({
        url: 'dealer/scene/sceneInfo',
        method: 'POST',
        data: param
    }).then(function (response) {
        return response.data
    });
}
export function DetailDeleteGroupSceneRef(param) {
    return fetch({
        url: 'dealer/group-scene-ref/GroupSceneDelete',
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
export function GroupSceneInsertBatch(param) {
    return fetch({
        url: 'dealer/group-scene-ref/infoInsertBatch',
        method: 'POST',
        data: param
    }).then(function (result) {
        Message({
            message: '批量关联场景成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}

export function Create(data) {
    return fetch({
        url: 'dealer/group-human',
        method: 'POST',
        data: data
    }).then(function (result) {
        if (result) {
            Message({
                message: '创建人员组成功',
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
        url: 'dealer/group-human/' + data.id,
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
        url: 'dealer/group-human/' + id,
        method: 'DELETE',
    }).then(function (result) {
        Message({
            message: '删除人员组成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}

export function BatchDelete(ids) {
    return fetch({
        url: 'dealer/group-human/delete',
        method: 'POST',
        data: ids
    }).then(function (result) {
        Message({
            message: '批量删除人员组成功',
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
            url: 'dealer/group-human/disable/' + id,
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
            url: 'dealer/group-human/enable/' + id,
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
            url: 'dealer/group-human/disable',
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
            url: 'dealer/group-human/enable',
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

export function VerifyHumanAndScene(ids) {
    return fetch({
        url: 'dealer/group-human/vaerifyHumanAndSceneRef',
        method: 'POST',
        data: ids
    }).then(function (result) {
        return result
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

export function GetBuilding(data) {
    return fetch({
        url: 'dealer/resource/getBuilding',
        method: 'POST',
        data: data
    }).then(function (result) {
        return result
    })
}

export function GetUnit(data) {
    return fetch({
        url: 'dealer/resource/getUnit',
        method: 'POST',
        data: data
    }).then(function (result) {
        return result
    })
}