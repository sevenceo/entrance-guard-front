/**
 * Created by xinquan.yu on 2017/7/5.
 */
import fetch from 'utils/fetch';

export function GetCatalog() {
    return fetch({
        url: 'http://localhost:3000/',
        method: 'get',
    }).then(function (result) {
        console.log("获取目录信息接口 返回信息")
        console.log(result)
        return result
    })
}
