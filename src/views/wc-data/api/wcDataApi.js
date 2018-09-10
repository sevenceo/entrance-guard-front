/**
 * Created by zhaimaojin on 2017/8/16.
 */
import fetch from 'utils/fetch';
// http://10.200.8.11:8010/wechat-account/
// import axios from 'axios'

export function GetDataList(page) {
    let params;

    if (page) {
        params = {
            page: page.page,
            size: page.size,
            name: page.name,
            type: page.type
        }
    }

    return fetch({
        url: '/datacenter/api/db-instances',
        method: 'get',
        params: params,
    }).then(function (response) {
        console.log("获取数据中心列表接口")
        console.log(response)
        // console.log(response.headers)
        // console.log(response.headers('X-Total-Count'))
        return response
    })

}
export function SearchDataList(page) {
    let params;

    if (page) {
        params = {
            page: page.page,
            size: page.size,
            keyword: page.keyword,
            databaseType:page.databaseType,
            instanceType: page.instanceType
        }
    }

    return fetch({
        url: '/datacenter/api/db-instances/search',
        method: 'get',
        params: params,
    }).then(function (response) {
        console.log("查询数据 列表接口")
        console.log(response)
        // console.log(response.headers)
        // console.log(response.headers('X-Total-Count'))
        return response
    })

}
export function ModifyData(data) {
    return fetch({
        url: '/datacenter/api/db-instances',
        method: 'put',
        data: data
    }).then(function (result) {
        console.log("编辑数据接口 返回信息")
        console.log(result)
        return result
    })
}

export function GetDataById(id) {
    return fetch({
        url: '/datacenter/api/db-instances/' + id,
        method: 'get',
    }).then(function (result) {
        console.log("获取单条数据 返回信息")
        console.log(result)
        return result
    })
}

export function CreateData(data) {
    return fetch({
        url: '/datacenter/api/db-instances',
        method: 'post',
        data: data
    }).then(function (result) {
        console.log("编辑数据接口 返回信息")
        console.log(result)
        return result
    })
}
export function GetAccountData(id) {
    return fetch({
        url: '/datacenter/api/db-instances/'+ id +"/accounts",
        method: 'get',
    }).then(function (result) {
        console.log("获取迁移公众号列表接口信息 返回信息")
        console.log(result)
        return result
    })
}


export function GetAccountHistories(id) {
    return fetch({
        url: '/datacenter/api/db-instances/'+ id +"/histories",
        method: 'get',
    }).then(function (result) {
        console.log("获取迁移历史 返回信息")
        console.log(result)
        return result
    })
}

export function TestConnection(data) {
    return fetch({
        url: '/datacenter/api/testConnection',
        method: 'post',
        data:data
    }).then(function (response) {
        console.log("测试链接  接口返回数据")
        console.log(response)

        return response
    })
}
export function GetAccountMoveList(id) {
    return fetch({
        url: '/datacenter/api/db-instances/'+ id +"/others",
        method: 'get',
    }).then(function (result) {
        console.log("获取迁移列表 返回信息")
        console.log(result)
        return result
    })
}

export function DeleteAccount(id) {
    return fetch({
        url: '/datacenter/api/db-instances/'+ id,
        method: 'delete',
    }).then(function (result) {
        console.log("删除帐号 返回信息")
        console.log(result)
        return result
    })
}
export function MoveComplete(mainDbInstanceId,destDbInstanceId,account) {

    console.log(mainDbInstanceId)
    console.log(destDbInstanceId)
    console.log(account)

    let params = {
        mainDbInstanceId : mainDbInstanceId,
        destDbInstanceId : destDbInstanceId,
        account : account
    }

    console.log(params.mainDbInstanceId)
    console.log(params.destDbInstanceId)
    console.log(params.account)

    return fetch({
        url: '/datacenter/api/moveComplete',
        method: 'post',
        params:params
    }).then(function (result) {
        console.log("迁移完成 返回信息")
        console.log(result)
        return result
    })
}

export function MoveShardingTable(mainDbInstanceId,destDbInstanceId,account) {

    let params = {
        mainDbInstanceId : mainDbInstanceId,
        destDbInstanceId : destDbInstanceId,
        account : account
    }

    return fetch({
        url: '/datacenter/api/moveShardingTable',
        method: 'post',
        params:params
    }).then(function (result) {
        console.log("迁移完成 返回信息")
        console.log(result)
        return result
    })
}



