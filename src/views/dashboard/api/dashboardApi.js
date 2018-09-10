/**
 * Created by Micheal Xiao on 2017/8/23.
 */
import fetch from 'utils/fetch';

// 获取粉丝数据信息
export function EfansSave(id) {
    return fetch({
        url: '/report-service/api/report/dashboard/'+id,
        method: 'get',
    }).then(function (result) {
        console.log("粉丝数据信息")
        console.log(result)
        return result
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
