/**
 * Created by zhaimaojin on 2017/8/23.
 */
import fetch from 'utils/fetch';

export function GetTree() {

    return fetch({
        url: '/organization/api/organizations/tree',
        method: 'get',
    }).then(function (response) {
        // console.log("获取tree 接口返回数据")
        // console.log(response)
        return response
    })
}

export function GetNodeChildren(id) {

    return fetch({
        url: '/organization/api/organizations/tree/'+ id,
        method: 'get',
    }).then(function (response) {
        // console.log("获取子节点 接口返回数据")
        // console.log(response)
        return response
    })
}
export function GetNodeChildrenInfo(id) {

    return fetch({
        url: '/organization/api/organizations/find/'+ id,
        method: 'get',
    }).then(function (response) {
        // console.log("获取子节点 接口返回数据")
        // console.log(response)
        return response
    })
}

export function CreateChildNode(organizationDTO,extendOrganizationDTO) {
    let data = tempInit(organizationDTO,extendOrganizationDTO);
    return fetch({
        url: '/organization/api/organizations/create',
        method: 'post',
        data: data
    }).then(function (response) {
        console.log("新建子节点接口")
        console.log(response)
        return response
    })
}
export function ModifyChildNode(organizationDTO,extendOrganizationDTO) {
    let data = tempInit(organizationDTO,extendOrganizationDTO);
    data['id'] = organizationDTO.id;
    return fetch({
        url: '/organization/api/organizations/modify',
        method: 'put',
        data: data
    }).then(function (response) {
        console.log("获取子节点 接口返回数据")
        console.log(response)
        return response
    })
}
export function DeleteChildNode(id) {
    return fetch({
        url: '/organization/api/organizations/delete/' + id,
        method: 'delete',
    }).then(function (response) {
        console.log("删除成功")
        console.log(response)
        return response
    })
}

export function GetProvinceList() {

    return fetch({
        url: '/basicdata/api/region/findAllProvinces',
        method: 'get'
    }).then(function (result) {
        console.log(result)
        return result
    })
}
export function GetCityList(id) {

    return fetch({
        url: '/basicdata/api/region/findCityByProvinceId/' + id,
        method: 'get'
    }).then(function (result) {
        console.log(result)
        return result
    })
}

export function GetAreasList(id) {

    return fetch({
        url: '/basicdata/api/region/findAreasByCityId/' + id,
        method: 'get'
    }).then(function (result) {
        console.log(result)
        return result
    })
}

export function getAllBrandList() {

    return fetch({
        url: '/basicdata/api/brand/search',
        method: 'post',
        params:{"status":"启用"}
    }).then(function (response) {
        return response
    })
}

//新增节点
function tempInit(organizationDTO,extendOrganizationDTO) {
    return {
        name: organizationDTO.name,
        address: organizationDTO.address,
        linkMan: organizationDTO.linkMan,
        tel: organizationDTO.tel,
        bewrite: organizationDTO.bewrite,
        enable: organizationDTO.enable,
        parentId:organizationDTO.parentId,
        "agencyShortname": extendOrganizationDTO.agencyShortname,
        "agencyType": extendOrganizationDTO.agencyType,
        "dol": extendOrganizationDTO.dol,
        "netIndentifyBrand": extendOrganizationDTO.netIndentifyBrand,
        "sap": extendOrganizationDTO.sap,
        "provinceName":extendOrganizationDTO.provinceName,
        "cityName":extendOrganizationDTO.cityName,
        "areasName":extendOrganizationDTO.areasName,
        "provinceId":extendOrganizationDTO.provinceId,
        "cityId":extendOrganizationDTO.cityId,
        "areasId":extendOrganizationDTO.areasId,
        "brands":extendOrganizationDTO.brands,
        "orgType":extendOrganizationDTO.orgType,
        "dealerCoder":extendOrganizationDTO.dealerCoder
    }
}



