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

            sceneName: page.sceneName,
        }, page);
    }

    return fetch({
        url: 'dealer/scene/page',
        method: 'POST',
        data: page
    }).then(function (response) {
        return response.data
    });
}

/*查看当前场景之外的摄像头*/
export function GetByIdsInfo(param) {
    return fetch({
        url: 'dealer/sensing-device/getByIdsInfo',
        method: 'POST',
        data: param
    }).then(function (response) {
        return response.data
    });
}

export function ScenceSenDevInsertBatch(param) {
    return fetch({
        url: 'dealer/scene-sensing-device-ref/infoInsertBatch',
        method: 'POST',
        data: param
    }).then(function (result) {
        Message({
            message: '批量关联摄像头成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}

export function ScenceSenDevDelete(param) {
    return fetch({
        url: 'dealer/scene-sensing-device-ref/infoDelete',
        method: 'POST',
        data: param
    }).then(function (result) {
        Message({
            message: '删除摄像头成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}

export function GetByIdResourceList(param) {
    return fetch({
        url: 'dealer/resource/resourceInfo',
        method: 'POST',
        data: param
    }).then(function (response) {
        return response.data
    });
}

export function SceneResourceDelete(param) {
    return fetch({
        url: 'dealer/resource-scene-ref/ResourceSceneDelete',
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

export function SceneResourceInsertBatch(param) {
    return fetch({
        url: 'dealer/resource-scene-scope/infoInsertBatch',
        method: 'POST',
        data: param
    }).then(function (result) {
        Message({
            message: '批量关联资源成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}

export function Create(data) {
    return fetch({
        url: 'dealer/scene',
        method: 'POST',
        data: data
    }).then(function (result) {
        if (result) {
            Message({
                message: '创建场景成功',
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
        url: 'dealer/scene/' + data.id,
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
        url: 'dealer/scene/' + id,
        method: 'DELETE',
    }).then(function (result) {
        Message({
            message: '删除场景成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}

export function BatchDelete(ids) {
    return fetch({
        url: 'dealer/scene/delete',
        method: 'POST',
        data: ids
    }).then(function (result) {
        Message({
            message: '批量删除场景成功',
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
            url: 'dealer/scene/disable/' + id,
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
            url: 'dealer/scene/enable/' + id,
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
            url: 'dealer/scene/disable',
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
            url: 'dealer/scene/enable',
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
        url: 'dealer/scene-control-ref/infoInsertBatch',
        method: 'POST',
        data: param
    }).then(function (result) {
        Message({
            message: '批量关联门禁控制器成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}

export function GetScenesBySensingId(id) {
    return fetch({
        url: 'dealer/scene/getScenesBySensingId/' + id,
        method: 'GET',
    }).then(function (result) {
        return result;
    })
}

export function UpdateScenes(param) {
    return fetch({
        url: 'dealer/scene/updateScenes',
        method: 'POST',
        data: param
    }).then(function (result) {
        if (result && result.status === 200 && result.data) {
            Message({
                message: '保存设置成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            });
        } else {
            Message({
                message: '保存设置失败',
                type: 'error',
                duration: 3 * 1000,
                showClose: true,
                customClass: 'msg-error',
                iconClass: 'sc'
            })
        }
        return result
    })
}

export function UpdateBackgroundImage(data, callBack, self) {
    return fetch({
        url: 'dealer/sensing-device/updateBackgroudImage',
        method: 'POST',
        data: data
    }).then(function (result) {
        callBack(result, self);
        return result;
    });
}



export function DeleteSceneControlRef(param) {
    return fetch({
        url: 'dealer/scene-control-ref/conditionsToDelete',
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

export function SceneResourceUpdate(param) {
    return fetch({
        url: 'dealer/resource/sceneResourceUpdate',
        method: 'POST',
        data: param
    }).then(function (result) {
        Message({
            message: '关联成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}

export function GetResourceBySceneId(sceneId) {
    return fetch({
        url: 'dealer/resource/getResourceBySceneId/'+sceneId,
        method: 'GET',
    }).then(function (result) {
        return result
    })
}