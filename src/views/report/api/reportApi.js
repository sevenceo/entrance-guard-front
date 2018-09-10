/**
 * Created by Micheal Xiao on 2017/8/23.
 */
import fetch from 'utils/fetch';

// 获取粉丝增长数据
export function EfansAdd(param) {
    return fetch({
        url: '/report-service/api/report/fansIncreaseReport',
        method: 'post',
        dataType: "json",
        headers: {'Content-Type': 'application/json'},
        data:param
    }).then(function (result) {
        console.log("粉丝增长报表")
        console.log(result)
        return result
    })
}
//菜单分析
export function MenuAnalysis(param) {
    return fetch({
        url: '/report-service/api/report/menuAnalysisReport',
        method: 'post',
        dataType: "json",
        headers: {'Content-Type': 'application/json'},
        data:param
    }).then(function (result) {
        console.log("菜单分析报表")
        console.log(result)
        return result
    })
}
//标签分析
export function TagAnalysis(param) {
    return fetch({
        url: '/report-service/api/report/tagAnalysisReport',
        method: 'post',
        dataType: "json",
        headers: {'Content-Type': 'application/json'},
        data:param
    }).then(function (result) {
        console.log("变迁分析报表")
        console.log(result)
        return result
    })
}
//二维码分布
export function QrCodeAnalysis(param) {
    return fetch({
        url: '/report-service/api/report/scanAnalysisReport',
        method: 'post',
        dataType: "json",
        headers: {'Content-Type': 'application/json'},
        data:param
    }).then(function (result) {
        console.log("二维码分布报表")
        console.log(result)
        return result
    })
}
//消息分析
export function MessageAnalysis(param) {
    return fetch({
        url: '/report-service/api/report/messageAnalysisReport',
        method: 'post',
        dataType: "json",
        headers: {'Content-Type': 'application/json'},
        data:param
    }).then(function (result) {
        console.log("消息分析报表")
        console.log(result)
        return result
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


export function GetOrgData(account) {

    return fetch({
        url: '/wechat-account/api/accounts/findorgwithaccount/' + account ,
        method: 'get',
    }).then(function (response) {
        console.log("获取组织机构  接口")
        console.log(response)
        return response
    })
}

// export function Global(id) {
//     return fetch({
//         url: '/task/api/report/global/'+id,
//         method: 'get',
//     }).then(function (result) {
//         console.log("Global报表")
//         console.log(result)
//         return result
//     })
// }
// export function Target(id) {
//     return fetch({
//         url: '/task/api/report/target/'+id,
//         method: 'get',
//     }).then(function (result) {
//         console.log("Target报表")
//         console.log(result)
//         return result
//     })
// }

export function GetFormFansData(params) {
    return fetch({
        url: '/report-service/api/form/fans' ,
        method: 'get',
        params:params
    }).then(function (response) {
        // console.log("粉丝增长表格统计")
        return response
    })
}

export function GetFormMenuData(params) {
    params.account=params.accounts[0];
    return fetch({
        url: '/report-service/api/form/menu' ,
        method: 'get',
        params:params
    }).then(function (response) {
        // console.log("粉丝增长表格统计")
        return response
    })
}


export function GetFormMessageData(params) {
    params.account=params.accounts[0];
    return fetch({
        url: '/report-service/api/form/message' ,
        method: 'get',
        params:params
    }).then(function (response) {
        // console.log("粉丝增长表格统计")
        return response
    })
}
export function GetFormScansData(page) {
    let params;
    if (page) {
        params = {
            page: page.page - 1,
            size: page.size,
            account:page.account,
            activityId: page.activityId
        }
    }
    return fetch({
        url: '/report-service/api/form/scan' ,
        method: 'get',
        params:params
    }).then(function (response) {
        // console.log("粉丝增长表格统计")
        return response
    })
}

export function GetFormTagsData(page) {
    let params;
    if (page) {
        params = {
            page: page.page - 1,
            size: page.size,
            account:page.account,
            tagId: page.tagId
        }
    }
    return fetch({
        url: '/report-service/api/form/tag' ,
        method: 'get',
        params:params
    }).then(function (response) {
        // console.log("粉丝增长表格统计")
        return response
    })
}


//导出
export function ExportAllFans(account,page) {
    let url = '/fans-service/api/fans/exportFans/'+account +"?nickName="+page.nickName
        +"&subscribeTimeStart="+getDate(page.subscribeTimeStart)
        +"&subscribeTimeEnd="+getDate(page.subscribeTimeEnd)
        +"&subscribeTimeStart="+getDate(page.lastActionTimeStart)
        +"&subscribeTimeEnd="+getDate(page.lastActionTimeEnd)
        +"&subscribeTimeStart="+getDate(page.unsubscribeTimeStart)
        +"&subscribeTimeEnd="+getDate(page.unsubscribeTimeEnd)
        +"&isSubscribe="+page.isSubscribe+"&phoneInfo="+page.phoneInfo;
    console.log(url);
    window.location.href = process.env.BASE_API+url;
}



//导出
export function ExportFansFrom(params) {
    params.accounts=params.accounts[0];
    let url = '/report-service/api/export/form/fans'+"?account="+params.account
        +"&beginDate="+params.beginDate
        +"&endDate="+params.endDate;
    console.log(url);
    window.location.href = process.env.BASE_API+url;
}
//导出
export function ExportScansFrom(params) {
    let url = '/report-service/api/export/form/scan'+"?account="+params.account
        +"&activityId="+params.activityId;
    console.log(url);
    window.location.href = process.env.BASE_API+url;
}
//导出
export function ExportTagsFrom(params) {
    let url = '/report-service/api/export/form/tag'+"?account="+params.account
        +"&tagId="+params.tagId;
    console.log(url);
    window.location.href = process.env.BASE_API+url;
}

//导出
export function ExportMenusFrom(params) {
    let url = '/report-service/api/export/form/menu/'+"?account="+params.account
        +"&beginDate="+params.beginDate
        +"&endDate="+params.endDate;
    console.log(url);
    window.location.href = process.env.BASE_API+url;
}

//导出
export function ExportMessagesFrom(params) {
    let url = '/report-service/api/export/form/message'+"?account="+params.account
        +"&beginDate="+params.beginDate
        +"&endDate="+params.endDate;
    console.log(url);
    window.location.href = process.env.BASE_API+url;
}


