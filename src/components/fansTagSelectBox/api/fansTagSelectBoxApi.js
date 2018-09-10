import fetch from 'utils/fetch';


export function SearchDataList(page) {
    let params;
    params = $.extend({},page);

    return fetch({
        url:'/wechat-userlabel/api/tag/search',
        method: 'post',
        params: params
    }).then(function (response) {
        return response

    })
}