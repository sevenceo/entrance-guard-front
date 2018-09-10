/**
 * Created by zyk on 2017/9/18.
 */

import fetch from 'utils/fetch';

export function SearchDataList(page,data,tags) {
    let dataParams = $.extend({},data);
    if(dataParams.state == '') {
        dataParams.state = 'NONE';
    }
    dataParams.chooseTags = '';
    if(tags.length != 0) {
        for(var i = 0; i < tags.length; i++) {
            if(i==0) {
                dataParams.chooseTags = tags[i].name;;
            } else {
                dataParams.chooseTags = dataParams.chooseTags + ',' + tags[i].name;
            }
        }
    }
    dataParams.createTime = new Date(getDate(dataParams.createTime));
    dataParams.createTimeEnd = new Date(getDate(dataParams.createTimeEnd));
    return fetch({
        url:'/wechat-userlabel/api/tag_group_config/search',
        method: 'post',
        params: page,
        data:dataParams
    }).then(function (response) {
        return response
    })
}

export function ExportAll(data,tags) {
    let dataParams = $.extend({},data);
    if(dataParams.state == '') {
        dataParams.state = 'NONE';
    }
    dataParams.chooseTags = '';
    if(tags.length != 0) {
        for(var i = 0; i < tags.length; i++) {
            if(i==0) {
                dataParams.chooseTags = tags[i].name;;
            } else {
                dataParams.chooseTags = dataParams.chooseTags + ',' + tags[i].name;
            }
        }
    }
    let url = '/wechat-userlabel/api/tag_group_config/excel?account=' + dataParams['account']+'&createTime='+dataParams['createTime']
        +'&createTimeEnd='+dataParams['createTimeEnd']+'&name='+dataParams['name']+'&state='+dataParams['state']+'&chooseTags='+dataParams['chooseTags'];
    window.location.href = process.env.BASE_API + url;
}

export function ExportFansGroup(id,account) {
    let url = '/wechat-userlabel/api/tag_group_config/exportFansExcel?account='+account+"&id="+id;
    window.location.href = process.env.BASE_API+url;
}

export function GetTreeData() {
    return fetch({
        url:'/wechat-userlabel/api/tag',
        method: 'get'
    }).then(function (response) {
        return response
    })
}

export function GetFansGroupManufacturerData(id,account) {
    return fetch({
        url:'/wechat-userlabel/api/tag_group_config/master/'+id+'/'+account,
        method: 'get'
    }).then(function (response) {
        return response
    })
}

export function GetFansGroupAgencyData(id,account) {
    return fetch({
        url:'/wechat-userlabel/api/tag_group_config/multiple/'+id+'/'+account,
        method: 'get'
    }).then(function (response) {
        return response
    })
}

export function GetFansList(groupId,account,page) {
    let params;
    if(page){
        params = {
            page: page.page - 1,
            size: page.size
        }
    }
    return  fetch({
        url: '/wechat-userlabel/api/tag_group_config/fans/'+account+'/'+groupId,
        method: 'get',
        params: params
    }).then(function (result) {
        console.log("粉丝列表接口")
        console.log(result)
        return result
    })
}

export function ModifyAgencyData(data) {
    return fetch({
        url:'/wechat-userlabel/api/tag_group_config/multiple',
        method: 'put',
        data : data
    }).then(function (response) {
        return response
    })
}

export function ModifyManufacturerData(data) {
    return fetch({
        url:'/wechat-userlabel/api/tag_group_config/master',
        method: 'put',
        data : data
    }).then(function (response) {
        return response
    })
}

export function CreateAgencyData(data) {
    data.createTime = new Date();
    return fetch({
        url:'/wechat-userlabel/api/tag_group_config/multiple',
        method: 'post',
        data : data
    }).then(function (response) {
        return response
    })
}

export function CreateManufacturerData(data) {
    data.createTime = new Date();
    return fetch({
        url:'/wechat-userlabel/api/tag_group_config/master',
        method: 'post',
        data : data
    }).then(function (response) {
        return response
    })
}

export function CountFansGroup(fansGroupData,account) {
    let data = $.extend({},fansGroupData);
    data.createTime = new Date();
    if(data.state == '启用') {
        data.state = 'ON';
    } else {
        data.state = 'OFF';
    }
    return fetch({
        method: 'post',
        url: '/wechat-userlabel/api/time_task/fansGroup/'+account,
        data: [data]
    }).then(function (result) {
        return result
    })
}

function getDate(date) {
    "use strict";
    if(date) {
        if(typeof(date) == 'string') {
            date = new Date(date);
        }
        var year = date.getFullYear();
        var month = ((date.getMonth() + 1) < 10 ? "0" : "")+(date.getMonth() + 1);
        var day = (date.getDate() < 10 ? "0" : "")+date.getDate();
        return year + "-" + month + "-" + day;
    }
    return date;
}


