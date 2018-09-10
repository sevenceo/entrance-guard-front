/**
 * Created by Micheal Xiao on 2017/6/19.
 */
import fetch from 'utils/fetch';

export function GetAuthoritiesList(page) {
    let params;
    if(page){
        params = {
            page:page.page - 1,
            size: page.size
        }
    }
    return fetch({
        url: process.env.BASE_API + '/uaa/api/authorities',
        method: 'get',
        params: params
    }).then(function (result) {
        console.log("get 权限 API")
        console.log(result)
        return result
    })
}

export function ImplementAuthorities(data) {
  return fetch({
    url: process.env.BASE_API + '/uaa/api/authorities',
    method: 'post',
    data: data
  }).then(function (result) {
    console.log("创建权限 返回信息")
    console.log(result)
    return result
  })
}
