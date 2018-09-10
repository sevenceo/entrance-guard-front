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

export function GetResourceCode() {
    return fetch({
        url: 'dealer/common/getCode',
        method: 'GET'
    }).then(function (response) {
        return response.data
    });
}

export function GetList(page) {
    let params;
    if (page) {
        params = $.extend({
            //分页信息
            page: page.page,
            pageNum: page.page,
            pageSize: page.size,

            //查询条件
            realName: page.realName,
            mobilePhone: page.mobilePhone,
            gender: page.gender,
            email: page.email,
        }, page);
    }

    return fetch({
        url: 'dealer/human/page',
        method: 'POST',
        data: page
    }).then(function (response) {
        return response.data
    });
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

export function HumanResourceDelete(param) {
    return fetch({
        url: 'dealer/human-resource-ref/humanResourceDelete',
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
export function HumanResourceInsertBatch(param,refType,isMember) {
    return fetch({
        url: 'dealer/human-resource-ref/infoInsertBatch/'+ refType + '/'+ isMember,
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

export function GetByIdSenceList(param) {
    return fetch({
        url: 'dealer/scene/sceneInfo',
        method: 'POST',
        data: param
    }).then(function (response) {
        return response.data
    });
}

export function GetAssociatedSenceList(param) {
    return fetch({
        url: 'dealer/scene/getSceneList',
        method: 'POST',
        data: param
    }).then(function (response) {
        return response.data
    });
}
export function DetailDeleteHumanSenceRef(param) {
    return fetch({
        url: 'dealer/human-scene-ref/humanSenceDelete',
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

export function HumanSenceInsertBatch(param) {
    return fetch({
        url: 'dealer/human-scene-ref/infoInsertBatch',
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
        url: 'dealer/human',
        method: 'POST',
        data: data
    }).then(function (result) {
        if (result) {
            Message({
                message: '创建人员成功',
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
        url: 'dealer/human/' + data.id,
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
        url: 'dealer/human/' + id,
        method: 'DELETE',
    }).then(function (result) {
        Message({
            message: '删除人员成功',
            type: 'success',
            customClass: 'msg-success',
            iconClass: 'ic'
        })
        return result
    })
}

export function BatchDelete(ids) {
    return fetch({
        url: 'dealer/human/delete',
        method: 'POST',
        data: ids
    }).then(function (result) {
        Message({
            message: '批量删除人员成功',
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
            url: 'dealer/human/disable/' + id,
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
            url: 'dealer/human/enable/' + id,
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
            url: 'dealer/human/disable',
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
            url: 'dealer/human/enable',
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

export function UpdateFeature(data) {
    return fetch({
        url: 'dealer/human/upload',
        method: 'POST',
        data: data
    }).then(function (result) {
        if(result && result.status === 200 && result.data && result.data == 'success'){
            Message({
                message: '上传成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            });
        }else{
            Message({
                message: '上传失败',
                type: 'error',
                duration: 3 * 1000,
                showClose: true,
                customClass:'msg-error',
                iconClass:'sc'
            })
        }
    })
}

export function BatchAudit(ids) {
    return fetch({
        url: 'dealer/human/audit',
        method: 'POST',
        data: ids
    }).then(function (result) {
        if(result && result.status === 200 && result.data && result.data.data == 'success'){
            Message({
                message: '审核成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            });
        }else{
            Message({
                message: '审核失败',
                type: 'error',
                duration: 3 * 1000,
                showClose: true,
                customClass:'msg-error',
                iconClass:'sc'
            })
        }
        return result
    })
}

export function Reject(id){
    return fetch({
        url: 'dealer/human/reject/'+id,
        method: 'GET',
    }).then(function (result) {
        return result
    });
}

export function GetRelationship(id){
    return fetch({
        url: 'dealer/owner-relationship/getRelationship/'+id,
        method: 'GET',
    }).then(function (result) {
        return result
    });
}

export function GetAllOrgs() {
    return fetch({
        url: '/dealer/ld-server/getAllOrgs',
        method: 'GET'
    }).then(function (result) {
        return result.data;
    })
}


export function GetResourceTree(){
    return fetch({
        url: 'dealer/resource/resourceList',
        method: 'POST',
        data: {}
    }).then(function (response) {
        return response.data
    });
}

export function JudgeHumanExistByPhone(phone, resourceId) {
    return fetch({
        url: 'dealer/human/'+ phone+"/"+resourceId,
        method: 'POST',
        data: {}
    }).then(function (response) {
        return response.data
    });
}

export function CreateResource(data) {
    return fetch({
        url: 'dealer/resource',
        method: 'POST',
        data: data
    }).then(function (result) {
        if (result.data.code=="0") {
            Message({
                message: '创建资源成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            })
            return result.data
        }else{
            Message({
                message: result.data.msg,
                customClass: 'msg-error',
                type: 'error',
                iconClass: 'ic'
            })
        }
    })
}

export function GetIdentityList() {
    return fetch({
        url: 'dealer/human/getIdentityDictionary',
        method: 'GET',
    }).then(function (response) {
        return response.data;
    })
}

export function GetResourceByLvlAndTenantIds() {
    return fetch({
        url: 'dealer/human/getResourceLvl0',
        method: 'GET',
    }).then(function (response) {
        return response.data;
    })
}

export function CreateHuman(param) {
    return fetch({
        url: 'dealer/human/insert',
        method: 'POST',
        data: param
    }).then(function (result) {
        if (result.data.code=="0") {
            Message({
                message: '新增人员成功',
                type: 'success',
                customClass: 'msg-success',
                iconClass: 'ic'
            })
            return result.data
        }else{
            Message({
                message: "新增人员失败",
                customClass: 'msg-error',
                type: 'error',
                iconClass: 'ic'
            })
        }
    })
}

export function GetIdentity(id) {
    return fetch({
        url: 'dealer/human/getIdentity/'+ refType,
        method: 'GET'
    }).then(function (result) {
        return result.data;
    })
}

export function GetResourceTreeForSearch() {
    return fetch({
        url: 'dealer/face-compare-history/getCorpAndOrg',
        method: 'GET',
    }).then(function (result) {
        return result.data;
    })
}

export function GetIsOrg() {
    return fetch({
        url: 'dealer/human/isOrg',
        method: 'GET',
    }).then(function (result) {
        return result.data;
    })
}

export function GetOrgIdentity() {
    return fetch({
        url: 'dealer/human/getOrgIdentity',
        method: 'GET',
    }).then(function (result) {
        return result.data;
    })
}

export function GetSenceListNotAssociated(param) {
    return fetch({
        url: 'dealer/scene/getSceneListNotAssociated',
        method: 'POST',
        data: param
    }).then(function (response) {
        return response.data
    });
}

export function GetHumanByResource(page) {
    return fetch({
        url: 'dealer/human/page',
        method: 'POST',
        data: page
    }).then(function (response) {
        return response.data
    });
}

export function GetResourceIdsByHumanId(id) {
    return fetch({
        url: 'dealer/human/getResourceIdsByHumanId/'+ id,
        method: 'get',
    }).then(function (response) {
        return response.data
    });
}

export function GetHumanResourceRefByIds(ids) {
    return fetch({
        url: 'dealer/human/getHumanResourceRefByIds',
        method: 'POST',
        data: ids
    }).then(function (result) {
        return result.data
    })
}

export function BeforeDelete(items){
    return fetch({
        url: 'attendance/searchHumanGroup',
        method: 'POST',
        data: items
    }).then(function (result) {
        return result.data
    })
}

export function DeleteAttendance(items) {
    return fetch({
        url: 'attendance/deleteHumanGroup',
        method: 'POST',
        data: items
    }).then(function (result) {
        return result.data
    })
}

export function GetAssociatedResource(items) {
    return fetch({
        url: 'dealer/resource/getAssociatedResource',
        method: 'POST',
        data: items
    }).then(function (result) {
        return result.data
    })
}
