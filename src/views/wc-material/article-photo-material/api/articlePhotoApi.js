/**
 * Created by Micheal Xiao on 2017/10/10.
 */
import fetch from 'utils/fetch';

export function GetArticlePhotoList(page) {
    let params;

    if(page){
        params = {
            pageNum:page.page,
            pageSize: page.size,
            // name: page.name,
            // type: page.type
        }
    }

    return fetch({
        url: '/material/api/we-chat-material-newss?account=gh_a1832ddc7ffe',
        method: 'get',
        params: params,
    }).then(function (response) {
        console.log("获取图文素材列表接口")
        console.log(response)
        return response
    })
}

export function GetTpls(tag) {
    return fetch({
        url: '/material/api/tpls',
        method: 'get',
        data:tag
    }).then(function (response) {
        console.log("获取图文模板接口")
        console.log(response)
        return response
    })
}

export function GetImagePaths() {
    return fetch({
        url: '/material/api/we-chat-material-newss/getImagePath',
        method: 'get'
    }).then(function (response) {
        return response
    })
}


